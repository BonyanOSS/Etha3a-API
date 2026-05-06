/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import hijriRoutes from '../src/modules/hijri/hijri.route';

describe('Hijri Controller', () => {
    const app = Fastify();

    beforeAll(async () => {
        await app.register(hijriRoutes);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('rejects bad gregorian date format', async () => {
        const res = await app.inject({ method: 'GET', url: '/hijri/from-gregorian?date=2026/05/06' });
        expect(res.statusCode).toBe(400);
    });

    it('requires a date for hijri-to-gregorian', async () => {
        const res = await app.inject({ method: 'GET', url: '/hijri/to-gregorian' });
        expect(res.statusCode).toBe(400);
    });

    it('returns today or fails gracefully', async () => {
        const res = await app.inject({ method: 'GET', url: '/hijri/today' });
        expect([200, 503]).toContain(res.statusCode);
    });
});
