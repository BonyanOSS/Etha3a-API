/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

export type ApiFunction<T> = () => Promise<T[]>;

/* ------------------ Reciters ------------------ */

interface Mp3QuranMoshaf {
    id: number;
    name: string;
    server: string;
}

interface Mp3QuranReciter {
    id: number;
    name: string;
    date: string;
    moshaf: Mp3QuranMoshaf[];
}

export interface Mp3QuranRecitersResponse {
    reciters: Mp3QuranReciter[];
}

export interface QuranComRecitationsResponse {
    recitations: {
        id: number;
        reciter_name: string;
        style: string | null;
        translated_name?: { name: string; language_name: string };
    }[];
}

/* ------------------ Surah ------------------ */

interface Mp3QuranSurah {
    id: number;
    name: string;
    makkia: number;
}

export interface Mp3QuranSurahResponse {
    suwar: Mp3QuranSurah[];
}

interface AlQuranSurah {
    id: number;
    name: string;
    revelationType: string;
}

export interface AlQuranSurahResponse {
    data: AlQuranSurah[];
}

export interface QuranComChaptersResponse {
    chapters: {
        id: number;
        name_arabic: string;
        name_simple: string;
        revelation_place: string;
    }[];
}

/* ------------------ Ayat ------------------ */

export interface AlQuranAyatResponse {
    data: {
        surahs: {
            number: number;
            name: string;
            ayahs: {
                number: number;
                text: string;
                numberInSurah: number;
            }[];
        }[];
    };
}

export interface QuranGadingFullResponse {
    code: number;
    data: {
        number: number;
        name: { short: string; long: string };
        verses: { number: { inQuran: number; inSurah: number }; text: { arab: string } }[];
    }[];
}

/* ------------------ Azkar ------------------ */

export type HisnMuslimResponse = Record<string, { ID: number; ARABIC_TEXT: string; TRANSLATED_TEXT?: string }[]>;

export interface AzkarFlatResponse {
    [category: string]: { count: string; description: string; reference?: string; zekr: string }[];
}

/* ------------------ Tafsir ------------------ */

export interface QuranEncTafsirResponse {
    result: {
        sura: number;
        aya: number;
        translation: string;
    }[];
}

export interface QuranComTafsirResponse {
    tafsir: { text: string; resource_name?: string };
}

export interface AlQuranAyaResponse {
    data: {
        number: number;
        text: string;
        numberInSurah: number;
        surah: { number: number; name: string };
    };
}

/* ------------------ Hadith ------------------ */

export interface HadithGadingBooksResponse {
    data: { id: string; name: string; available: number }[];
}

export interface HadithGadingBookResponse {
    data: {
        name: string;
        id: string;
        available: number;
        hadiths: { number: number; arab: string; id: string }[];
    };
}

/* ------------------ Prayer Times ------------------ */

export interface AlAdhanTimingsResponse {
    data: {
        timings: Record<string, string>;
        date: { readable: string; gregorian: { date: string }; hijri: { date: string } };
        meta: { latitude: number; longitude: number; method: { id: number; name: string } };
    };
}

export interface PrayZoneTimesResponse {
    results: {
        datetime: { times: Record<string, string>; date: { gregorian: string; hijri: string } }[];
    };
}

/* ------------------ Hijri ------------------ */

export interface AlAdhanHijriResponse {
    data: {
        hijri: { date: string; day: string; month: { number: number; en: string; ar: string }; year: string; weekday: { en: string; ar: string } };
        gregorian: { date: string; day: string; month: { number: number; en: string }; year: string };
    };
}

/* ------------------ Qibla ------------------ */

export interface AlAdhanQiblaResponse {
    data: { latitude: number; longitude: number; direction: number };
}
