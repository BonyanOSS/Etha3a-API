/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

export function normalizeArabic(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
        .replace(/[إأآا]/g, 'ا')
        .replace(/[يى]/g, 'ي')
        .replace(/[ؤو]/g, 'و')
        .replace(/[ةه]/g, 'ه')
        .replace(/[ئ]/g, 'ي')
        .replace(/آ/g, 'ا')
        .replace(/[^ء-ي\s]/g, '')
        .toLowerCase()
        .trim();
}

export function normalizeArabicForQuranSearch(text: string): string {
    if (!text) return '';

    return text
        .normalize('NFKD')
        .replace(/\u0670/g, 'ا')
        .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/\u0671/g, 'ا')
        .replace(/[ىئ]/g, 'ي')
        .replace(/[ؤئ]/g, 'ء')
        .replace(/ة/g, 'ه')
        .replace(/\u0640/g, '')
        .replace(/[^\u0621-\u064A\u0660-\u0669\s]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();
}
