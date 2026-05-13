/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyInstance } from 'fastify';
import { convertGregorianToHijri, convertHijriToGregorian, getToday } from './hijri.controller.js';

export default async function hijriRoutes(fastify: FastifyInstance) {
    fastify.get('/hijri/today', getToday);
    fastify.get('/hijri/from-gregorian', convertGregorianToHijri);
    fastify.get('/hijri/to-gregorian', convertHijriToGregorian);
}
