/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import type { ApiFunction, Mp3QuranSurahResponse, AlQuranSurahResponse } from '@/src/types/Api.js';
import type { SurahItem } from '@/src/types/Items.js';

export const surahApis: ApiFunction<SurahItem>[] = [
    async () => {
        const res = await fetch('https://www.mp3quran.net/api/v3/suwar');
        if (!res.ok) throw new Error('API mp3quran.net failed');

        const json = (await res.json()) as Mp3QuranSurahResponse;

        return json.suwar.map((s) => ({
            id: s.id,
            name: s.name,
            makkia: s.makkia === 1 ? true : s.makkia === 0 ? false : undefined,
            apiName: 'mp3quran.net',
        }));
    },

    async () => {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('API alquran.cloud failed');

        const json = (await res.json()) as AlQuranSurahResponse;

        return json.data.map((s) => ({
            id: s.id,
            name: s.name,
            makkia: s.revelationType.toLowerCase() === 'meccan',
            apiName: 'alquran.cloud',
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
    const surah = await fetchWithFallback(surahApis);
    return { surah };
}
