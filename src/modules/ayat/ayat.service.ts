/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { ApiFunction, AlQuranAyatResponse } from '@/src/types/Api.js';
import type { SurahWithAyaItem } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

interface FawazQuranEdition {
    quran: { chapter: number; verse: number; text: string }[];
}

export const ayatApis: ApiFunction<SurahWithAyaItem[]>[] = [
    async () => {
        const res = await fetchWithTimeout('https://api.alquran.cloud/v1/quran/quran-uthmani', {}, 20000);
        if (!res.ok) throw new Error('alquran.cloud full quran failed');

        const json = (await res.json()) as AlQuranAyatResponse;

        const surahs: SurahWithAyaItem[] = json.data.surahs.map((surah) => ({
            number: surah.number,
            name: surah.name,
            ayat: surah.ayahs.map((ayah) => ({
                number: ayah.number,
                text: ayah.text,
                numberInSurah: ayah.numberInSurah,
            })),
            apiName: 'alquran.cloud' as const,
        }));

        return [surahs];
    },

    async () => {
        const res = await fetchWithTimeout('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf.json', {}, 20000);
        if (!res.ok) throw new Error('jsdelivr quran-api fallback failed');

        const json = (await res.json()) as FawazQuranEdition;
        const grouped = new Map<number, { number: number; text: string; numberInSurah: number }[]>();

        let absoluteNumber = 0;
        for (const verse of json.quran) {
            absoluteNumber += 1;
            const list = grouped.get(verse.chapter) ?? [];
            list.push({ number: absoluteNumber, text: verse.text, numberInSurah: verse.verse });
            grouped.set(verse.chapter, list);
        }

        const surahs: SurahWithAyaItem[] = Array.from(grouped.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([num, ayat]) => ({
                number: num,
                name: `سورة ${num}`,
                ayat,
                apiName: 'cdn.jsdelivr.net/fawazahmed0/quran-api' as const,
            }));

        return [surahs];
    },
];

export async function fetchWithFallback<T>(apis: ApiFunction<T>[]): Promise<T[]> {
    let lastError: Error | null = null;

    for (const api of apis) {
        try {
            const result = await api();
            if (result.length > 0) return result;
        } catch (err) {
            lastError = err instanceof Error ? err : new Error('Unknown error');
        }
    }

    if (lastError) throw lastError;
    return [];
}

export async function getAyatContent(): Promise<{ surahs: SurahWithAyaItem[] }> {
    const results = await memoize('ayat:full', () => fetchWithFallback(ayatApis), { ttlMs: 1000 * 60 * 60 * 24 });
    const surahs = results[0] || [];
    return { surahs };
}
