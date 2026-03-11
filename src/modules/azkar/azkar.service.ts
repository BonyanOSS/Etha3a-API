/*

 * Etha3a – Quran & Azkar API

 * Copyright (c) 2026 RlxChap2 and kremdev

 * MIT License

 */

import type { ApiFunction, HisnmuslimItem } from '@/src/types/Api.js';
import { AzkarCategories, AzkarEndpoints } from '@/src/types/Items.js';

export function azkarApis(id: number): ApiFunction<HisnmuslimItem>[] {
    return [
        async () => {
            const res = await fetch(`https://www.hisnmuslim.com/api/ar/${id}.json`);
            if (!res.ok) throw new Error('hisnmuslim API failed');
            const json = await res.json();

            const items = (Object.values(json)[0] ?? []) as HisnmuslimItem[];
            return items.map((item) => ({ ...item, apiName: 'hisnmuslim.com' }));
        },
    ];
}

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

export async function getAzkar(type: AzkarCategories) {
    const id = AzkarEndpoints[type];
    return fetchWithFallback(azkarApis(id));
}
