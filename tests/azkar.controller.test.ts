/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import azkarRoutes from '../src/modules/azkar/azkar.route';

describe('Azkar Controller', () => {
    const app = Fastify();

    beforeAll(async () => {
        await app.register(azkarRoutes);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('lists categories or fails gracefully', async () => {
        const res = await app.inject({ method: 'GET', url: '/azkar' });
        expect([200, 503]).toContain(res.statusCode);
    });

    it('rejects empty search', async () => {
        const res = await app.inject({ method: 'GET', url: '/azkar/search' });
        expect(res.statusCode).toBe(400);
    });

    it('returns 503 or random zekr', async () => {
        const res = await app.inject({ method: 'GET', url: '/azkar/random' });
        expect([200, 503, 404]).toContain(res.statusCode);
    });
});
