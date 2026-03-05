/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import radioRoutes from '../src/modules/reciters/reciters.route';

describe('GET /reciters', () => {
    const app = Fastify();
    app.register(radioRoutes);

    it('should return radio list', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/reciters',
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.data).toBeDefined();
    });
});
