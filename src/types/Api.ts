/*

 * Etha3a – Quran & Azkar API

 * Copyright (c) 2026 RlxChap2 and kremdev

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

/* ------------------ Mp3Quran Surah ------------------ */

interface Mp3QuranSurah {
    id: number;
    name: string;
    makkia: number;
}

export interface Mp3QuranSurahResponse {
    suwar: Mp3QuranSurah[];
}

/* ------------------ AlQuran API ------------------ */

interface AlQuranSurah {
    id: number;
    name: string;
    revelationType: string;
}

export interface AlQuranSurahResponse {
    data: AlQuranSurah[];
}

/* ------------------ AlQuran API ------------------ */

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

/* ------------------ Hisnmuslim API ------------------ */

// export interface HisnmuslimItem {
//     ID: number;
//     ARABIC_TEXT: string;
//     LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
//     TRANSLATED_TEXT: string;
//     REPEAT: number;
//     AUDIO: string;
// }
