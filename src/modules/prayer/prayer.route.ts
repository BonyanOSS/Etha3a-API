/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { getTimings } from './prayer.controller.js';

export default async function prayerRoutes(fastify: FastifyInstance) {
    fastify.get('/prayer/times', getTimings);
}
