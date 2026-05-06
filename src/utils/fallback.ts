/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

export type ApiFn<T> = () => Promise<T>;

export interface FallbackOptions {
    timeoutMs?: number;
    isEmpty?: (result: unknown) => boolean;
}

export async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(input, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

export async function runWithFallback<T>(apis: ApiFn<T>[], options: FallbackOptions = {}): Promise<T> {
    const isEmpty = options.isEmpty ?? defaultIsEmpty;
    let lastError: Error | null = null;

    for (const api of apis) {
        try {
            const result = await api();
            if (!isEmpty(result)) return result;
            lastError = new Error('Empty result from source');
        } catch (err) {
            lastError = err instanceof Error ? err : new Error('Unknown error');
        }
    }

    throw lastError ?? new Error('No APIs available');
}

function defaultIsEmpty(result: unknown): boolean {
    if (result === null || result === undefined) return true;
    if (Array.isArray(result)) return result.length === 0;
    return false;
}
