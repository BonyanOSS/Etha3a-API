/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getTafsirEditions, getTafsirForAya, getTafsirForSurah } from './tafsir.controller.js';

export default async function tafsirRoutes(fastify: FastifyInstance) {
    fastify.get('/tafsir', getTafsirEditions);
    fastify.get('/tafsir/:edition/:surah', getTafsirForSurah);
    fastify.get('/tafsir/:edition/:surah/:aya', getTafsirForAya);
}
