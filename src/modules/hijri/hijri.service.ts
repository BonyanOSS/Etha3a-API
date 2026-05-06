/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import type { AlAdhanHijriResponse } from '@/src/types/Api.js';
import type { HijriDate } from '@/src/types/Items.js';
import { fetchWithTimeout } from '../../utils/fallback.js';
import { memoize } from '../../utils/cache.js';

function map(json: AlAdhanHijriResponse): HijriDate {
    return {
        hijri: {
            date: json.data.hijri.date,
            day: json.data.hijri.day,
            month: json.data.hijri.month.en,
            monthAr: json.data.hijri.month.ar,
            year: json.data.hijri.year,
            weekday: json.data.hijri.weekday.en,
            weekdayAr: json.data.hijri.weekday.ar,
        },
        gregorian: {
            date: json.data.gregorian.date,
            day: json.data.gregorian.day,
            month: json.data.gregorian.month.en,
            year: json.data.gregorian.year,
        },
        apiName: 'aladhan.com',
    };
}

async function callAlAdhan(path: string, date: string): Promise<HijriDate> {
    const res = await fetchWithTimeout(`https://api.aladhan.com/v1/${path}/${date}`, {}, 8000);
    if (!res.ok) throw new Error(`aladhan ${path} failed`);
    const json = (await res.json()) as AlAdhanHijriResponse;
    return map(json);
}

export async function gregorianToHijri(date: string): Promise<HijriDate> {
    return memoize(`hijri:g2h:${date}`, () => callAlAdhan('gToH', date), { ttlMs: 1000 * 60 * 60 * 24 * 7 });
}

export async function hijriToGregorian(date: string): Promise<HijriDate> {
    return memoize(`hijri:h2g:${date}`, () => callAlAdhan('hToG', date), { ttlMs: 1000 * 60 * 60 * 24 * 7 });
}
