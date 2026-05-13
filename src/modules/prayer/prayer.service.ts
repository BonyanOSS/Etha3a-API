/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { ApiFunction, AlAdhanTimingsResponse, PrayZoneTimesResponse } from '@/src/types/Api.js';
import type { PrayerTimings } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

export interface PrayerQuery {
    date: string; // DD-MM-YYYY
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
    method?: number;
}

function todayDDMMYYYY(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function buildAlAdhanQuery(q: PrayerQuery): string {
    const params = new URLSearchParams();
    if (q.method !== undefined) params.set('method', String(q.method));
    if (q.latitude !== undefined) params.set('latitude', String(q.latitude));
    if (q.longitude !== undefined) params.set('longitude', String(q.longitude));
    if (q.city) params.set('city', q.city);
    if (q.country) params.set('country', q.country);
    return params.toString();
}

export function buildApis(q: PrayerQuery): ApiFunction<PrayerTimings>[] {
    const hasCoords = q.latitude !== undefined && q.longitude !== undefined;
    const hasCity = !!q.city && !!q.country;

    const apis: ApiFunction<PrayerTimings>[] = [];

    if (hasCoords) {
        apis.push(async () => {
            const url = `https://api.aladhan.com/v1/timings/${q.date}?${buildAlAdhanQuery(q)}`;
            const res = await fetchWithTimeout(url, {}, 10000);
            if (!res.ok) throw new Error('aladhan timings failed');
            const json = (await res.json()) as AlAdhanTimingsResponse;
            return [mapAlAdhan(json)];
        });
    }

    if (hasCity) {
        apis.push(async () => {
            const url = `https://api.aladhan.com/v1/timingsByCity/${q.date}?${buildAlAdhanQuery(q)}`;
            const res = await fetchWithTimeout(url, {}, 10000);
            if (!res.ok) throw new Error('aladhan timingsByCity failed');
            const json = (await res.json()) as AlAdhanTimingsResponse;
            return [mapAlAdhan(json)];
        });
    }

    if (hasCoords && q.date === todayDDMMYYYY()) {
        apis.push(async () => {
            const url = `https://api.pray.zone/v2/times/today.json?longitude=${q.longitude}&latitude=${q.latitude}`;
            const res = await fetchWithTimeout(url, {}, 10000);
            if (!res.ok) throw new Error('pray.zone today failed');
            const json = (await res.json()) as PrayZoneTimesResponse;
            const today = json.results.datetime[0];
            if (!today) throw new Error('pray.zone empty result');
            return [
                {
                    date: today.date.gregorian,
                    hijri: today.date.hijri,
                    timings: today.times as PrayerTimings['timings'],
                    apiName: 'pray.zone',
                },
            ];
        });
    }

    return apis;
}

function mapAlAdhan(json: AlAdhanTimingsResponse): PrayerTimings {
    return {
        date: json.data.date.gregorian.date,
        hijri: json.data.date.hijri.date,
        timings: json.data.timings as PrayerTimings['timings'],
        method: json.data.meta.method.name,
        coordinates: { latitude: json.data.meta.latitude, longitude: json.data.meta.longitude },
        apiName: 'aladhan.com',
    };
}

async function fetchWithFallback(apis: ApiFunction<PrayerTimings>[]): Promise<PrayerTimings> {
    let lastError: Error | null = null;
    for (const api of apis) {
        try {
            const result = await api();
            if (result.length > 0 && result[0]) return result[0];
        } catch (err) {
            lastError = err instanceof Error ? err : new Error('Unknown error');
        }
    }
    throw lastError ?? new Error('No prayer time APIs available');
}

export async function getPrayerTimes(q: PrayerQuery): Promise<PrayerTimings> {
    const cacheKey = `prayer:${q.date}:${q.latitude ?? ''}:${q.longitude ?? ''}:${q.city ?? ''}:${q.country ?? ''}:${q.method ?? ''}`;

    return memoize(
        cacheKey,
        async () => {
            const apis = buildApis(q);
            if (apis.length === 0) throw new Error('Provide either coordinates (latitude+longitude) or city+country');
            return fetchWithFallback(apis);
        },
        { ttlMs: 1000 * 60 * 60 },
    );
}
