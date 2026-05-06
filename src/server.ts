/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import recitersRoutes from './modules/reciters/reciters.route.js';
import surahRoutes from './modules/surah/surah.route.js';
import ayatRoutes from './modules/ayat/ayat.route.js';
import azkarRoutes from './modules/azkar/azkar.route.js';
import tafsirRoutes from './modules/tafsir/tafsir.route.js';
import hadithRoutes from './modules/hadith/hadith.route.js';
import prayerRoutes from './modules/prayer/prayer.route.js';
import hijriRoutes from './modules/hijri/hijri.route.js';
import qiblaRoutes from './modules/qibla/qibla.route.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

await app.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX) || 120,
    timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
});

type RouteInfo = {
    method: string | string[];
    url: string;
    schema?: object;
};

const allRoutes: RouteInfo[] = [];

app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.url === '/' || routeOptions.url === '/health') return;
    allRoutes.push({
        method: routeOptions.method,
        url: routeOptions.url,
        schema: routeOptions.schema,
    });
});

app.get('/', async () => ({
    name: 'Etha3a-API',
    description: 'Quran & Azkar API with multi-source fallback',
    routes: allRoutes,
}));

app.get('/health', async () => ({ status: 'ok', code: 200, timestamp: new Date().toISOString() }));

app.setNotFoundHandler((req, reply) => {
    reply.status(404).send({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    app.log.error(err);
    const status = err.statusCode ?? 500;
    if (status >= 400 && status < 500) {
        return reply.status(status).send({ success: false, message: err.message });
    }
    return reply.status(500).send({ success: false, message: 'Internal server error' });
});

await app.register(recitersRoutes);
await app.register(surahRoutes);
await app.register(ayatRoutes);
await app.register(azkarRoutes);
await app.register(tafsirRoutes);
await app.register(hadithRoutes);
await app.register(prayerRoutes);
await app.register(hijriRoutes);
await app.register(qiblaRoutes);

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen({ port, host }).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
