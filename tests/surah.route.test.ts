/*
 * Etha3a – Quran & Azkar API
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

    it('should return 404 for non-existing surah', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/999',
        });

        expect(res.statusCode).toBe(404);
    });

    /**
     * dependes on mp3quran api, so we will test it later on another test suite
     * @todo test surah by name using any another api that provides surah by name, or mock the mp3quran api response
     */
    it('should return surah by name', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/surah/search?name=الفاتحة',
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.data).toBeDefined();
    });
});
