/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getAllAzkar, getZekrByCategory } from './azkar.controller.js';

export default async function azkarRoutes(fastify: FastifyInstance) {
    fastify.get('/azkar', getAllAzkar);

    fastify.get('/azkar/:category', getZekrByCategory);
}
