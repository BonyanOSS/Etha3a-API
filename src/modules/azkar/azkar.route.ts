/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getAzkarByCategory, getAzkarCategories, getRandomZekr, searchAzkar } from './azkar.controller.js';

export default async function azkarRoutes(fastify: FastifyInstance) {
    fastify.get('/azkar', getAzkarCategories);
    fastify.get('/azkar/random', getRandomZekr);
    fastify.get('/azkar/search', searchAzkar);
    fastify.get('/azkar/:category', getAzkarByCategory);
}
