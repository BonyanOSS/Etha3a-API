/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import surahRoutes from '../src/modules/surah/surah.route';

describe('GET /surah', () => {
    const app = Fastify();

    beforeAll(async () => {
        await app.register(surahRoutes);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return surah list', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah',
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.data).toBeDefined();
    });

    it('should return surah by id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/1',
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.data).toBeDefined();
    });

    it('should return 400 for out-of-range surah id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/999',
        });

        expect(res.statusCode).toBe(400);
    });

    it('should return surah by name (live)', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/search?name=الفاتحة',
        });

        expect([200, 404, 503]).toContain(res.statusCode);
    });

    it('should reject empty search name', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/search?name=',
        });

        expect(res.statusCode).toBe(400);
    });
});
