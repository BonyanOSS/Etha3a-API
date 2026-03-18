/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

/* ------------------ RecitersItem ------------------ */

export interface ReciterItem {
    id: number;
    name: string;
    makkia?: boolean;
    date?: string;
    moshaf?: {
        id: number;
        name: string;
        server: string;
    }[];
    apiName: 'mp3quran.net';
}

/* ------------------ SurahsItem ------------------ */

export interface SurahItem {
    id: number;
    name: string;
    makkia?: boolean;
    revelationType?: boolean;
    apiName: 'mp3quran.net' | 'alquran.cloud';
}

/* ------------------ AyaItem ------------------ */

export interface AyaItem {
    number: number;
    text: string;
    numberInSurah: number;
}

/* ------------------ AzkarCategory  ------------------ */

export type Zekr = {
    readonly zekr: string;
    readonly repeat: number;
};

export type AzkarItem = {
    category: AzkarCategory;
    items: Zekr[];
    sunnah?: string;
};

export enum AzkarCategory {
    morning = 'أذكار الصباح',
    evening = 'أذكار المساء',
    sleep = 'أذكار النوم',
    wakeup = 'أذكار الاستيقاظ',
}

/* ------------------ SurahWithAyaItem ------------------ */

export interface SurahWithAyaItem {
    number: number;
    name: string;
    ayat: AyaItem[];
    apiName: 'alquran.cloud';
}
