/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memoize, invalidate, clearCache } from '../src/utils/cache';

describe('memoize', () => {
    beforeEach(() => clearCache());

    it('caches the loader result for subsequent calls', async () => {
        const loader = vi.fn(async () => ({ value: 1 }));
        const a = await memoize('k', loader);
        const b = await memoize('k', loader);
        expect(a).toEqual(b);
        expect(loader).toHaveBeenCalledTimes(1);
    });

    it('coalesces concurrent calls into one loader execution', async () => {
        const loader = vi.fn(async () => {
            await new Promise((r) => setTimeout(r, 30));
            return 42;
        });
        const [a, b, c] = await Promise.all([memoize('coalesce', loader), memoize('coalesce', loader), memoize('coalesce', loader)]);
        expect([a, b, c]).toEqual([42, 42, 42]);
        expect(loader).toHaveBeenCalledTimes(1);
    });

    it('invalidate forces a reload', async () => {
        const loader = vi.fn(async () => Math.random());
        const a = await memoize('rand', loader);
        invalidate('rand');
        const b = await memoize('rand', loader);
        expect(loader).toHaveBeenCalledTimes(2);
        expect(a).not.toBe(b);
    });

    it('expires entries after ttlMs', async () => {
        const loader = vi.fn(async () => Date.now());
        await memoize('ttl', loader, { ttlMs: 5 });
        await new Promise((r) => setTimeout(r, 15));
        await memoize('ttl', loader, { ttlMs: 5 });
        expect(loader).toHaveBeenCalledTimes(2);
    });
});
