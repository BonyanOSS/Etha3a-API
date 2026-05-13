/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { ApiFunction, Mp3QuranSurahResponse, AlQuranSurahResponse, QuranComChaptersResponse } from '@/src/types/Api.js';
import type { SurahItem } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

export const surahApis: ApiFunction<SurahItem>[] = [
    async () => {
        const res = await fetchWithTimeout('https://www.mp3quran.net/api/v3/suwar');
        if (!res.ok) throw new Error('mp3quran.net suwar failed');

        const json = (await res.json()) as Mp3QuranSurahResponse;

        return json.suwar.map((s) => ({
            id: s.id,
            name: s.name,
            makkia: s.makkia === 1 ? true : s.makkia === 0 ? false : undefined,
            apiName: 'mp3quran.net' as const,
        }));
    },

    async () => {
        const res = await fetchWithTimeout('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('alquran.cloud surah failed');

        const json = (await res.json()) as AlQuranSurahResponse;

        return json.data.map((s) => ({
            id: s.id,
            name: s.name,
            makkia: s.revelationType.toLowerCase() === 'meccan',
            apiName: 'alquran.cloud' as const,
        }));
    },

    async () => {
        const res = await fetchWithTimeout('https://api.quran.com/api/v4/chapters?language=ar');
        if (!res.ok) throw new Error('quran.com chapters failed');

        const json = (await res.json()) as QuranComChaptersResponse;

        return json.chapters.map((c) => ({
            id: c.id,
            name: c.name_arabic,
            makkia: c.revelation_place.toLowerCase() === 'makkah',
            apiName: 'quran.com' as const,
        }));
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

export async function getSurahContent(): Promise<{ surah: SurahItem[] }> {
    const surah = await memoize('surah:all', () => fetchWithFallback(surahApis), { ttlMs: 1000 * 60 * 60 * 12 });
    return { surah };
}
