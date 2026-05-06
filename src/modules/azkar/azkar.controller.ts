/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzkarContent } from './azkar.service.js';
import { normalizeArabic } from '../../utils/arabic.js';
import { fail, ok, unavailable } from '../../utils/http.js';

export async function getAzkarCategories(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getAzkarContent();
        return ok(reply, {
            categories: data.categories.map((c) => ({ name: c.category, count: c.items.length, apiName: c.apiName })),
        });
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getAzkarByCategory(req: FastifyRequest<{ Params: { category: string } }>, reply: FastifyReply) {
    const target = decodeURIComponent(req.params.category).trim();
    if (!target) return fail(reply, 400, 'Category is required');

    try {
        const data = await getAzkarContent();
        const search = normalizeArabic(target);
        const category = data.categories.find((c) => normalizeArabic(c.category).includes(search));

        if (!category) return fail(reply, 404, 'Category not found');
        return ok(reply, category);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function searchAzkar(req: FastifyRequest<{ Querystring: { text?: string; limit?: string } }>, reply: FastifyReply) {
    const text = req.query.text?.trim();
    if (!text) return fail(reply, 400, 'Query parameter "text" is required');

    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '50', 10) || 50, 1), 200);

    try {
        const data = await getAzkarContent();
        const search = normalizeArabic(text);
        const results: { category: string; item: { id: number; text: string; count?: number } }[] = [];

        for (const cat of data.categories) {
            for (const item of cat.items) {
                if (normalizeArabic(item.text).includes(search)) {
                    results.push({ category: cat.category, item });
                    if (results.length >= limit) break;
                }
            }
            if (results.length >= limit) break;
        }

        if (results.length === 0) return fail(reply, 404, `No azkar found containing "${text}"`);
        return reply.send({ success: true, total: results.length, data: results });
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getRandomZekr(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getAzkarContent();
        const allItems: { category: string; item: { id: number; text: string; count?: number } }[] = [];
        for (const cat of data.categories) {
            for (const item of cat.items) allItems.push({ category: cat.category, item });
        }

        if (allItems.length === 0) return fail(reply, 404, 'No azkar available');
        const pick = allItems[Math.floor(Math.random() * allItems.length)];
        return ok(reply, pick);
    } catch (err) {
        return unavailable(reply, err);
    }
}
