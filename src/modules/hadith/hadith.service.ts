/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { HadithBook, HadithItem } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

interface GadingBooksPayload {
    data: { id: string; name: string; available: number }[];
}

interface GadingBookPayload {
    data: {
        id: string;
        name: string;
        available: number;
        hadiths: { number: number; arab: string; id: string }[];
    };
}

const PRIMARY_BOOKS_URL = 'https://api.hadith.gading.dev/books';
const FALLBACK_BOOKS_URL = 'https://cdn.jsdelivr.net/gh/sutanlab/hadith-api@master/data/index.json';

interface JsdelivrBook {
    id: string;
    name: string;
    available: number;
}

async function fetchBooksPrimary(): Promise<HadithBook[]> {
    const res = await fetchWithTimeout(PRIMARY_BOOKS_URL, {}, 10000);
    if (!res.ok) throw new Error('hadith.gading.dev books failed');
    const json = (await res.json()) as GadingBooksPayload;
    return json.data.map((b) => ({ ...b, apiName: 'hadith.gading.dev' as const }));
}

async function fetchBooksFallback(): Promise<HadithBook[]> {
    const res = await fetchWithTimeout(FALLBACK_BOOKS_URL, {}, 10000);
    if (!res.ok) throw new Error('jsdelivr hadith books failed');
    const json = (await res.json()) as JsdelivrBook[];
    return json.map((b) => ({ ...b, apiName: 'hadith.gading.dev' as const }));
}

export async function listBooks(): Promise<HadithBook[]> {
    return memoize(
        'hadith:books',
        async () => {
            try {
                return await fetchBooksPrimary();
            } catch {
                return await fetchBooksFallback();
            }
        },
        { ttlMs: 1000 * 60 * 60 * 24 },
    );
}

async function fetchBookFromGading(bookId: string, range: { from: number; to: number }) {
    const url = `https://api.hadith.gading.dev/books/${bookId}?range=${range.from}-${range.to}`;
    const res = await fetchWithTimeout(url, {}, 12000);
    if (!res.ok) throw new Error('hadith.gading.dev book failed');
    const json = (await res.json()) as GadingBookPayload;
    const hadiths: HadithItem[] = json.data.hadiths.map((h) => ({
        number: h.number,
        text: h.arab,
        book: json.data.name,
        apiName: 'hadith.gading.dev',
    }));
    return { book: json.data.name, available: json.data.available, hadiths };
}

async function fetchBookFromCdn(bookId: string, range: { from: number; to: number }) {
    const url = `https://cdn.jsdelivr.net/gh/sutanlab/hadith-api@master/data/${bookId}.json`;
    const res = await fetchWithTimeout(url, {}, 15000);
    if (!res.ok) throw new Error('jsdelivr hadith book failed');
    const json = (await res.json()) as { name: string; available: number; hadiths: { number: number; arab: string }[] };

    const sliced = json.hadiths.filter((h) => h.number >= range.from && h.number <= range.to);
    return {
        book: json.name,
        available: json.available,
        hadiths: sliced.map((h) => ({ number: h.number, text: h.arab, book: json.name, apiName: 'hadith.gading.dev' as const })),
    };
}

export async function getBook(bookId: string, range?: { from: number; to: number }) {
    const window = range ?? { from: 1, to: 30 };
    const cacheKey = `hadith:book:${bookId}:${window.from}-${window.to}`;

    return memoize(
        cacheKey,
        async () => {
            try {
                return await fetchBookFromGading(bookId, window);
            } catch (primary) {
                try {
                    return await fetchBookFromCdn(bookId, window);
                } catch {
                    throw primary instanceof Error ? primary : new Error('Hadith fallback failed');
                }
            }
        },
        { ttlMs: 1000 * 60 * 60 * 12 },
    );
}

export async function getHadith(bookId: string, number: number): Promise<HadithItem | null> {
    const data = await getBook(bookId, { from: number, to: number });
    return data.hadiths.find((h) => h.number === number) ?? null;
}
