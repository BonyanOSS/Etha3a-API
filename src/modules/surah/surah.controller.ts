/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getSurahContent } from './surah.service.js';
import { normalizeArabic } from '../../utils/arabic.js';

export async function getSurah(req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getSurahContent();
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}

export async function getSurahById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const data = await getSurahContent();

        const surah = data.surah.find((s) => s.id === parseInt(req.params.id));

        if (!surah) {
            return reply.status(404).send({
                success: false,
                message: 'Surah not found',
            });
        }

        return reply.send({
            success: true,
            data: surah,
        });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}

export async function getSurahByName(req: FastifyRequest<{ Querystring: { name: string } }>, reply: FastifyReply) {
    const name = req.query.name;
    const data = await getSurahContent();

    const search = normalizeArabic(name);

    const surahData = data.surah.find((r) => normalizeArabic(r.name).includes(search));

    if (!surahData) {
        return reply.status(404).send({
            success: false,
            message: 'Surah not found',
        });
    }

    return reply.send({
        success: true,
        data: surahData,
    });
}
