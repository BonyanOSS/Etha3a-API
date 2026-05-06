/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { AlAdhanQiblaResponse } from '@/src/types/Api.js';
import type { QiblaInfo } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function localQiblaDirection(lat: number, lng: number): number {
    const phiK = (KAABA_LAT * Math.PI) / 180;
    const lambdaK = (KAABA_LNG * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return (angle + 360) % 360;
}

async function fromAlAdhan(lat: number, lng: number): Promise<QiblaInfo> {
    const res = await fetchWithTimeout(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`, {}, 8000);
    if (!res.ok) throw new Error('aladhan qibla failed');
    const json = (await res.json()) as AlAdhanQiblaResponse;
    return {
        latitude: json.data.latitude,
        longitude: json.data.longitude,
        direction: json.data.direction,
        apiName: 'aladhan.com',
    };
}

export async function getQibla(lat: number, lng: number): Promise<QiblaInfo> {
    const cacheKey = `qibla:${lat.toFixed(4)}:${lng.toFixed(4)}`;
    return memoize(
        cacheKey,
        async () => {
            try {
                return await fromAlAdhan(lat, lng);
            } catch {
                return {
                    latitude: lat,
                    longitude: lng,
                    direction: localQiblaDirection(lat, lng),
                    apiName: 'aladhan.com',
                };
            }
        },
        { ttlMs: 1000 * 60 * 60 * 24 * 30 },
    );
}
