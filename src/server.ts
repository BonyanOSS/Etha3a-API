/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';

import radioRoutes from './modules/reciters/reciters.route.js';
import surahRoutes from './modules/surah/surah.route.js';
import ayatRoutes from './modules/ayat/ayat.route.js';

const app = Fastify({ logger: true });

await app.register(cors, {
    origin: true,
});

type RouteInfo = {
    method: string | string[];
    url: string;
    schema?: object;
};

const allRoutes: RouteInfo[] = [];

app.addHook('onRoute', (routeOptions) => {
    allRoutes.push({
        method: routeOptions.method,
        url: routeOptions.url,
        schema: routeOptions.schema,
    });
});

app.get('/', async () => ({ routes: allRoutes }));
app.get('/health', async () => ({ status: 'ok', code: 200 }));

app.register(radioRoutes);
app.register(surahRoutes);
app.register(ayatRoutes);

const port = Number(process.env.PORT) || 3000;
app.listen({ port });
