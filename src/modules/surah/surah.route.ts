/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getSurahById, getSurah, getSurahByName } from './surah.controller.js';

export default async function surahRoutes(fastify: FastifyInstance) {
    fastify.get('/surah', getSurah);

    fastify.get('/surah/:id', getSurahById);

    fastify.get('/surah/search', getSurahByName);
}
