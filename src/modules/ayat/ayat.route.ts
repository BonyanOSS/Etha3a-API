/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getAllAyat, getAyatById, getAyatBySurah, getAyatByText } from './ayat.controller.js';

export default async function ayatRoutes(fastify: FastifyInstance) {
    fastify.get('/ayat/search', getAyatByText);

    fastify.get('/ayat', getAllAyat);

    fastify.get('/ayat/:surah/aya/:id', getAyatBySurah);

    fastify.get('/ayat/:id', getAyatById);
}
