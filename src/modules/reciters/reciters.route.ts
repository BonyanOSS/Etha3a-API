/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getRadio, getReciterById, getReciterByName, getReciterSurah } from './reciters.controller.js';

export default async function radioRoutes(fastify: FastifyInstance) {
    fastify.get('/reciters', getRadio);

    fastify.get('/reciters/:id', getReciterById);

    fastify.get('/reciters/search/:name', getReciterByName);

    fastify.get('/reciters/:id/surah/:surah', getReciterSurah);
}
