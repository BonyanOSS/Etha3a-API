/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { qiblaDirection } from './qibla.controller.js';

export default async function qiblaRoutes(fastify: FastifyInstance) {
    fastify.get('/qibla', qiblaDirection);
}
