/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getAyatContent } from './ayat.service.js';
import type { AyaItem } from '@/src/types/Items.js';
import { normalizeArabicForQuranSearch } from '@/src/utils/arabic.js';

export async function getAllAyat(req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getAyatContent();
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}

export async function getAyatById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return reply.status(400).send({
            success: false,
            message: 'Invalid Aya ID',
        });
    } else if (id < 1 || id > 6236) {
        return reply.status(400).send({
            success: false,
            message: 'ID must be between 1 and 6236',
        });
    }

    const data = await getAyatContent();

    for (const surah of data.surahs) {
        const aya = surah.ayat.find((a) => a.number === id);
        if (aya) {
            return reply.send({
                success: true,
                data: {
                    surahNumber: surah.number,
                    surahName: surah.name,
                    aya,
                },
            });
        }
    }

    return reply.status(404).send({
        success: false,
        message: 'Aya not found',
    });
}

export async function getAyatBySurah(req: FastifyRequest<{ Params: { surah: string; id: string } }>, reply: FastifyReply) {
    const surahNum = parseInt(req.params.surah);
    const ayaNum = parseInt(req.params.id);

    if (isNaN(surahNum) || isNaN(ayaNum)) {
        return reply.status(400).send({
            success: false,
            message: 'Surah and Aya numbers must be valid integers',
        });
    }

    const data = await getAyatContent();

    const surah = data.surahs.find((s) => s.number === surahNum);
    if (!surah) {
        return reply.status(404).send({
            success: false,
            message: `Surah ${surahNum} not found`,
        });
    }

    const aya = surah.ayat.find((a) => a.numberInSurah === ayaNum);
    if (!aya) {
        return reply.status(404).send({
            success: false,
            message: `Aya ${ayaNum} in Surah ${surahNum} not found`,
        });
    }

    return reply.send({
        success: true,
        data: {
            surahNumber: surah.number,
            surahName: surah.name,
            aya,
        },
    });
}
export async function getAyatByText(req: FastifyRequest<{ Querystring: { text: string } }>, reply: FastifyReply) {
    const text = req.query.text;
    if (!text) {
        return reply.status(400).send({
            success: false,
            message: 'Query parameter "text" is required',
        });
    }

    const data = await getAyatContent();

    const results: {
        surahNumber: number;
        surahName: string;
        aya: AyaItem;
    }[] = [];

    const queryNorm = normalizeArabicForQuranSearch(text);

    for (const surah of data.surahs) {
        for (const aya of surah.ayat) {
            const ayaNorm = normalizeArabicForQuranSearch(aya.text);
            if (ayaNorm.includes(queryNorm)) {
                results.push({
                    surahNumber: surah.number,
                    surahName: surah.name,
                    aya,
                });
            }
        }
    }

    if (results.length === 0) {
        return reply.status(404).send({
            success: false,
            message: `No Ayat found containing "${text}"`,
        });
    }

    return reply.send({
        success: true,
        total: results.length,
        data: results,
    });
}
