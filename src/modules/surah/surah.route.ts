/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getSurahById, getSurah, getSurahByName } from './surah.controller.js';

export default async function surahRoutes(fastify: FastifyInstance) {
    fastify.get('/surah', getSurah);

    fastify.get('/surah/:id', getSurahById);

    fastify.get('/surah/search', getSurahByName);
}
