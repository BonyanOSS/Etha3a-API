/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

export type ApiFunction<T> = () => Promise<T[]>;

/* ------------------ Reciters ------------------ */

export interface Mp3QuranMoshaf {
    id: number;
    name: string;
    server: string;
}

export interface Mp3QuranReciter {
    id: number;
    name: string;
    date: string;
    moshaf: Mp3QuranMoshaf[];
}

export interface Mp3QuranRecitersResponse {
    reciters: Mp3QuranReciter[];
}

/* ------------------ Mp3Quran Surah ------------------ */

export interface Mp3QuranSurah {
    id: number;
    name: string;
    makkia: number;
}

export interface Mp3QuranSurahResponse {
    suwar: Mp3QuranSurah[];
}

/* ------------------ AlQuran API ------------------ */

export interface AlQuranSurah {
    id: number;
    name: string;
    revelationType: string;
}

export interface AlQuranSurahResponse {
    data: AlQuranSurah[];
}
