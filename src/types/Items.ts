/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

export type SurahApiSource = 'mp3quran.net' | 'alquran.cloud' | 'quran.com';
export type ReciterApiSource = 'mp3quran.net' | 'quran.com';
export type AyatApiSource = 'alquran.cloud' | 'cdn.jsdelivr.net/fawazahmed0/quran-api';
export type AzkarApiSource = 'hisnmuslim.com' | 'github.com/nawafalqari';
export type TafsirApiSource = 'alquran.cloud' | 'quranenc.com';
export type HadithApiSource = 'hadith.gading.dev' | 'cdn.jsdelivr.net/sutanlab/hadith-api';
export type PrayerApiSource = 'aladhan.com' | 'pray.zone';
export type HijriApiSource = 'aladhan.com';
export type QiblaApiSource = 'aladhan.com' | 'local';

/* ------------------ RecitersItem ------------------ */

export interface ReciterItem {
    id: number;
    name: string;
    date?: string;
    moshaf?: {
        id: number;
        name: string;
        server: string;
    }[];
    style?: string | null;
    apiName: ReciterApiSource;
}

/* ------------------ SurahsItem ------------------ */

export interface SurahItem {
    id: number;
    name: string;
    makkia?: boolean;
    apiName: SurahApiSource;
}

/* ------------------ AyaItem ------------------ */

export interface AyaItem {
    number: number;
    text: string;
    numberInSurah: number;
}

export interface SurahWithAyaItem {
    number: number;
    name: string;
    ayat: AyaItem[];
    apiName: AyatApiSource;
}

/* ------------------ Azkar ------------------ */

export interface AzkarItem {
    id: number;
    text: string;
    count?: number;
    reference?: string;
    description?: string;
}

export interface AzkarCategory {
    category: string;
    items: AzkarItem[];
    apiName: AzkarApiSource;
}

/* ------------------ Tafsir ------------------ */

export interface TafsirItem {
    surah: number;
    aya: number;
    text: string;
    edition: string;
    apiName: TafsirApiSource;
}

/* ------------------ Hadith ------------------ */

export interface HadithBook {
    id: string;
    name: string;
    available: number;
    apiName: HadithApiSource;
}

export interface HadithItem {
    number: number;
    text: string;
    book: string;
    apiName: HadithApiSource;
}

/* ------------------ Prayer Times ------------------ */

export interface PrayerTimings {
    date: string;
    hijri?: string;
    timings: {
        Fajr: string;
        Sunrise?: string;
        Dhuhr: string;
        Asr: string;
        Sunset?: string;
        Maghrib: string;
        Isha: string;
        Imsak?: string;
        Midnight?: string;
    };
    method?: string;
    coordinates?: { latitude: number; longitude: number };
    apiName: PrayerApiSource;
}

/* ------------------ Hijri ------------------ */

export interface HijriDate {
    hijri: { date: string; day: string; month: string; monthAr: string; year: string; weekday: string; weekdayAr: string };
    gregorian: { date: string; day: string; month: string; year: string };
    apiName: HijriApiSource;
}

/* ------------------ Qibla ------------------ */

export interface QiblaInfo {
    latitude: number;
    longitude: number;
    direction: number;
    apiName: QiblaApiSource;
}
