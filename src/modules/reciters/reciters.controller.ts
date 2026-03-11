/*

 * Etha3a – Quran & Azkar API

 * Copyright (c) 2026 RlxChap2 and kremdev

 * MIT License

 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getRadioContent } from './reciters.service.js';
import { normalizeArabic } from '../../utils/arabic.js';

export async function getRadio(req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getRadioContent();
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}

export async function getReciterById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const data = await getRadioContent();

        const reciter = data.reciters.find((r) => r.id === parseInt(req.params.id));

        if (!reciter) {
            return reply.status(404).send({
                success: false,
                message: 'Reciter not found',
            });
        }

        return reply.send({
            success: true,
            data: reciter,
        });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}

export async function getReciterSurah(req: FastifyRequest<{ Params: { id: string; surah: string } }>, reply: FastifyReply) {
    const surahNum = parseInt(req.params.surah);

    if (Number.isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
        return reply.status(400).send({
            success: false,
            message: 'Invalid surah number. Must be between 1 and 114',
        });
    }

    const data = await getRadioContent();

    const reciter = data.reciters.find((r) => r.id === parseInt(req.params.id));

    if (!reciter) {
        return reply.status(404).send({
            success: false,
            message: 'Reciter not found',
        });
    }

    if (!reciter.moshaf || reciter.moshaf.length === 0) {
        return reply.status(404).send({
            success: false,
            message: 'No moshaf available for this reciter',
        });
    }

    const moshafItem = reciter.moshaf[0];

    if (!moshafItem?.server) {
        return reply.status(404).send({
            success: false,
            message: 'Server information not available for this reciter',
        });
    }

    const surah = surahNum.toString().padStart(3, '0');
    const audio = `${moshafItem.server}${surah}.mp3`;

    return reply.send({
        data: {
            success: true,
            reciter: reciter.name,
            surah: surahNum,
            audio,
        },
    });
}

export async function getReciterByName(req: FastifyRequest<{ Querystring: { name: string } }>, reply: FastifyReply) {
    const name = req.query.name;
    const data = await getRadioContent();

    const search = normalizeArabic(name);

    const reciterData = data.reciters.find((r) => normalizeArabic(r.name).includes(search));

    if (!reciterData) {
        return reply.status(404).send({
            success: false,
            message: 'Reciter not found',
        });
    }

    return reply.send({
        success: true,
        data: reciterData,
    });
}
