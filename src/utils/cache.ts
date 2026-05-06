/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export interface MemoizeOptions {
    ttlMs?: number;
}

export async function memoize<T>(key: string, loader: () => Promise<T>, options: MemoizeOptions = {}): Promise<T> {
    const ttl = options.ttlMs ?? 1000 * 60 * 30;
    const now = Date.now();

    const cached = store.get(key) as CacheEntry<T> | undefined;
    if (cached && cached.expiresAt > now) return cached.value;

    const existing = inflight.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    const task = (async () => {
        try {
            const value = await loader();
            store.set(key, { value, expiresAt: Date.now() + ttl });
            return value;
        } finally {
            inflight.delete(key);
        }
    })();

    inflight.set(key, task);
    return task;
}

export function invalidate(key: string): void {
    store.delete(key);
    inflight.delete(key);
}

export function clearCache(): void {
    store.clear();
    inflight.clear();
}
