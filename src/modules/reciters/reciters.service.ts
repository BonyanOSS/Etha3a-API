/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { ApiFunction, Mp3QuranRecitersResponse, QuranComRecitationsResponse } from '@/src/types/Api.js';
import type { ReciterItem } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

export const reciterApis: ApiFunction<ReciterItem>[] = [
    async () => {
        const res = await fetchWithTimeout('https://www.mp3quran.net/api/v3/reciters');
        if (!res.ok) throw new Error('mp3quran.net reciters failed');

        const json = (await res.json()) as Mp3QuranRecitersResponse;

        return json.reciters.map((s) => ({
            id: s.id,
            name: s.name,
            date: s.date,
            moshaf: s.moshaf.map((m) => ({ id: m.id, name: m.name, server: m.server })),
            apiName: 'mp3quran.net' as const,
        }));
    },

    async () => {
        const res = await fetchWithTimeout('https://api.quran.com/api/v4/resources/recitations?language=ar');
        if (!res.ok) throw new Error('quran.com recitations failed');

        const json = (await res.json()) as QuranComRecitationsResponse;

        return json.recitations.map((r) => ({
            id: r.id,
            name: r.translated_name?.name || r.reciter_name,
            style: r.style,
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

export async function getRadioContent(): Promise<{ reciters: ReciterItem[] }> {
    const reciters = await memoize('reciters:all', () => fetchWithFallback(reciterApis), { ttlMs: 1000 * 60 * 60 });
    return { reciters };
}
