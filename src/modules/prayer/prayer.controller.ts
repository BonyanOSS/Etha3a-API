/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getPrayerTimes } from './prayer.service.js';
import { fail, ok, unavailable } from '../../utils/http.js';

interface PrayerQS {
    date?: string;
    latitude?: string;
    longitude?: string;
    city?: string;
    country?: string;
    method?: string;
}

function todayDDMMYYYY(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function isValidDate(value: string): boolean {
    return /^\d{2}-\d{2}-\d{4}$/.test(value);
}

function parseFloatOpt(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : NaN;
}

export async function getTimings(req: FastifyRequest<{ Querystring: PrayerQS }>, reply: FastifyReply) {
    const date = req.query.date?.trim() || todayDDMMYYYY();
    if (!isValidDate(date)) return fail(reply, 400, 'Date must be in DD-MM-YYYY format');

    const lat = parseFloatOpt(req.query.latitude);
    const lng = parseFloatOpt(req.query.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return fail(reply, 400, 'latitude/longitude must be numeric');

    const method = req.query.method !== undefined ? parseInt(req.query.method, 10) : undefined;
    if (method !== undefined && Number.isNaN(method)) return fail(reply, 400, 'method must be an integer');

    const city = req.query.city?.trim() || undefined;
    const country = req.query.country?.trim() || undefined;

    if ((lat === undefined || lng === undefined) && (!city || !country)) {
        return fail(reply, 400, 'Provide either latitude+longitude OR city+country');
    }

    try {
        const result = await getPrayerTimes({ date, latitude: lat, longitude: lng, city, country, method });
        return ok(reply, result);
    } catch (err) {
        return unavailable(reply, err);
    }
}
