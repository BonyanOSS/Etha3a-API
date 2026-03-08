/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import type { ApiFunction, AlQuranAyatResponse } from '@/src/types/Api.js';
import type { SurahWithAyaItem } from '@/src/types/Items.js';

export const ayatApis: ApiFunction<SurahWithAyaItem[]>[] = [
    async () => {
        const res = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
        if (!res.ok) throw new Error('API alquran.cloud failed');

        const json = (await res.json()) as AlQuranAyatResponse;

        const surahs: SurahWithAyaItem[] = json.data.surahs.map((surah) => ({
            number: surah.number,
            name: surah.name,
            ayat: surah.ayahs.map((ayah) => ({
                number: ayah.number,
                text: ayah.text,
                numberInSurah: ayah.numberInSurah,
            })),
            apiName: 'alquran.cloud'
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
    const results = await fetchWithFallback(ayatApis);
    const surahs = results[0] || [];
    return { surahs };
}