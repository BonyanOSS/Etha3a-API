/*

 * Etha3a – Quran & Azkar API

 * Copyright (c) 2026 RlxChap2 and kremdev

 * MIT License

 */

import type { ApiFunction, Mp3QuranRecitersResponse } from '@/src/types/Api.js';
import type { ReciterItem } from '@/src/types/Items.js';

export const reciterApis: ApiFunction<ReciterItem>[] = [
    async () => {
        const res = await fetch('https://www.mp3quran.net/api/v3/reciters');
        if (!res.ok) throw new Error('API mp3quran.net failed');

        const json = (await res.json()) as Mp3QuranRecitersResponse;

        return json.reciters.map((s) => ({
            id: s.id,
            name: s.name,
            date: s.date,
            moshaf: s.moshaf.map((m) => ({
                id: m.id,
                name: m.name,
                server: m.server,
            })),
            apiName: 'mp3quran.net',
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

export async function getRadioContent(): Promise<{ reciters: ReciterItem[] }> {
    const reciters = await fetchWithFallback(reciterApis);
    return { reciters };
}
