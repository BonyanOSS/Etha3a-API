/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getHadithBook, getHadithBooks, getHadithByNumber, getRandomHadith } from './hadith.controller.js';

export default async function hadithRoutes(fastify: FastifyInstance) {
    fastify.get('/hadith', getHadithBooks);
    fastify.get('/hadith/random', getRandomHadith);
    fastify.get('/hadith/:book', getHadithBook);
    fastify.get('/hadith/:book/:number', getHadithByNumber);
}
