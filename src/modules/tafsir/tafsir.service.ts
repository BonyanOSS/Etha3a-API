/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { TafsirItem } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

interface AlQuranAyaPayload {
    data: { number: number; numberInSurah: number; text: string; surah: { number: number } };
}

interface AlQuranSurahPayload {
    data: { number: number; ayahs: { number: number; numberInSurah: number; text: string }[] };
}

interface QuranEncSura {
    result: { sura: number; aya: number; translation: string }[];
}

const SUPPORTED_EDITIONS: Record<string, { alquran?: string; quranenc?: string; label: string }> = {
    muyassar: { alquran: 'ar.muyassar', quranenc: 'arabic_moyassar', label: 'التفسير الميسر' },
    jalalayn: { alquran: 'ar.jalalayn', label: 'تفسير الجلالين' },
    saadi: { quranenc: 'arabic_saadi', label: 'تفسير السعدي' },
    waseet: { alquran: 'ar.waseet', label: 'التفسير الوسيط' },
    qurtubi: { alquran: 'ar.qurtubi', label: 'تفسير القرطبي' },
};

export type TafsirEdition = keyof typeof SUPPORTED_EDITIONS;

export function isSupportedEdition(value: string): value is TafsirEdition {
    return value in SUPPORTED_EDITIONS;
}

export function listEditions(): { id: string; label: string }[] {
    return Object.entries(SUPPORTED_EDITIONS).map(([id, meta]) => ({ id, label: meta.label }));
}

async function fetchFromAlQuran(edition: string, surah: number, aya?: number): Promise<TafsirItem[]> {
    if (aya !== undefined) {
        const ref = `${surah}:${aya}`;
        const res = await fetchWithTimeout(`https://api.alquran.cloud/v1/ayah/${ref}/${edition}`, {}, 8000);
        if (!res.ok) throw new Error('alquran.cloud aya tafsir failed');
        const json = (await res.json()) as AlQuranAyaPayload;
        return [
            {
                surah: json.data.surah.number,
                aya: json.data.numberInSurah,
                text: json.data.text,
                edition,
                apiName: 'alquran.cloud',
            },
        ];
    }

    const res = await fetchWithTimeout(`https://api.alquran.cloud/v1/surah/${surah}/${edition}`, {}, 12000);
    if (!res.ok) throw new Error('alquran.cloud surah tafsir failed');
    const json = (await res.json()) as AlQuranSurahPayload;
    return json.data.ayahs.map((a) => ({
        surah: json.data.number,
        aya: a.numberInSurah,
        text: a.text,
        edition,
        apiName: 'alquran.cloud' as const,
    }));
}

async function fetchFromQuranEnc(edition: string, surah: number, aya?: number): Promise<TafsirItem[]> {
    const res = await fetchWithTimeout(`https://quranenc.com/api/v1/translation/sura/${edition}/${surah}`, {}, 12000);
    if (!res.ok) throw new Error('quranenc.com sura failed');
    const json = (await res.json()) as QuranEncSura;
    const all: TafsirItem[] = json.result.map((v) => ({
        surah: v.sura,
        aya: v.aya,
        text: v.translation,
        edition,
        apiName: 'quranenc.com',
    }));
    return aya === undefined ? all : all.filter((i) => i.aya === aya);
}

export async function getTafsir(editionKey: TafsirEdition, surah: number, aya?: number): Promise<TafsirItem[]> {
    const meta = SUPPORTED_EDITIONS[editionKey];
    if (!meta) throw new Error('Unsupported edition');

    const cacheKey = `tafsir:${editionKey}:${surah}:${aya ?? 'all'}`;

    return memoize(
        cacheKey,
        async () => {
            let lastError: Error | null = null;

            if (meta.alquran) {
                try {
                    return await fetchFromAlQuran(meta.alquran, surah, aya);
                } catch (err) {
                    lastError = err instanceof Error ? err : new Error('Unknown error');
                }
            }

            if (meta.quranenc) {
                try {
                    return await fetchFromQuranEnc(meta.quranenc, surah, aya);
                } catch (err) {
                    lastError = err instanceof Error ? err : new Error('Unknown error');
                }
            }

            throw lastError ?? new Error('No tafsir source available');
        },
        { ttlMs: 1000 * 60 * 60 * 24 },
    );
}
