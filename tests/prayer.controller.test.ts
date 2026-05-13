/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import prayerRoutes from '../src/modules/prayer/prayer.route';

describe('Prayer Times Controller', () => {
    const app = Fastify();

    beforeAll(async () => {
        await app.register(prayerRoutes);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('rejects request without coords or city', async () => {
        const res = await app.inject({ method: 'GET', url: '/prayer/times' });
        expect(res.statusCode).toBe(400);
    });

    it('rejects bad date format', async () => {
        const res = await app.inject({ method: 'GET', url: '/prayer/times?date=2026/01/01&latitude=21.4225&longitude=39.8262' });
        expect(res.statusCode).toBe(400);
    });

    it('rejects non-numeric coordinates', async () => {
        const res = await app.inject({ method: 'GET', url: '/prayer/times?latitude=abc&longitude=def' });
        expect(res.statusCode).toBe(400);
    });

    it('returns timings for Mecca or fails gracefully', async () => {
        const res = await app.inject({ method: 'GET', url: '/prayer/times?latitude=21.4225&longitude=39.8262' });
        expect([200, 503]).toContain(res.statusCode);
    });
});
