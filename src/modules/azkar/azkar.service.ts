/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { AzkarCategory, AzkarItem } from '@/src/types/Items.js';
import type { ApiFunction } from '@/src/types/Api.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

interface HisnEntry {
    ID: number;
    ARABIC_TEXT: string;
    TRANSLATED_TEXT?: string;
    REPEAT?: number;
}

type HisnIndex = { English: { ID: number; TITLE: string }[] } | Record<string, HisnEntry[]>;

interface NawafCategory {
    category: string;
    count: string;
    description: string;
    content?: string;
    reference?: string;
    zekr: string;
}

export const azkarApis: ApiFunction<AzkarCategory>[] = [
    async () => {
        const res = await fetchWithTimeout(
            'https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json',
            {},
            12000,
        );
        if (!res.ok) throw new Error('nawafalqari azkar failed');

        const json = (await res.json()) as Record<string, NawafCategory[]>;
        const categories: AzkarCategory[] = [];

        for (const [name, items] of Object.entries(json)) {
            const azkarItems: AzkarItem[] = items.map((it, idx) => ({
                id: idx + 1,
                text: it.zekr,
                count: parseCount(it.count),
                description: it.description || undefined,
                content: it.content || undefined,
                reference: it.reference || undefined,
            }));
            categories.push({ category: name, items: azkarItems, apiName: 'github.com/nawafalqari' });
        }

        return categories;
    },

    async () => {
        const res = await fetchWithTimeout('https://www.hisnmuslim.com/api/ar/husn_ar.json', {}, 12000);
        if (!res.ok) throw new Error('hisnmuslim azkar failed');

        const json = (await res.json()) as HisnIndex;
        const categories: AzkarCategory[] = [];

        for (const [name, entries] of Object.entries(json)) {
            if (!Array.isArray(entries)) continue;
            const items: AzkarItem[] = (entries as HisnEntry[]).map((e) => ({
                id: e.ID,
                text: e.ARABIC_TEXT,
                count: e.REPEAT,
            }));
            categories.push({ category: name, items, apiName: 'hisnmuslim.com' });
        }

        if (categories.length === 0) throw new Error('hisnmuslim returned empty');
        return categories;
    },
];

function parseCount(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
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

export async function getAzkarContent(): Promise<{ categories: AzkarCategory[] }> {
    const categories = await memoize('azkar:all', () => fetchWithFallback(azkarApis), { ttlMs: 1000 * 60 * 60 * 24 });
    return { categories };
}
