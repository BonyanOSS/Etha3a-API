/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getRadioContent } from './reciters.service.js';
import { normalizeArabic } from '../../utils/arabic.js';
import { fail, ok, unavailable } from '../../utils/http.js';

export async function getRadio(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await getRadioContent();
        return ok(reply, data);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getReciterById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return fail(reply, 400, 'Invalid reciter id');

    try {
        const data = await getRadioContent();
        const reciter = data.reciters.find((r) => r.id === id);
        if (!reciter) return fail(reply, 404, 'Reciter not found');
        return ok(reply, reciter);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getReciterSurah(req: FastifyRequest<{ Params: { id: string; surah: string } }>, reply: FastifyReply) {
    const reciterId = parseInt(req.params.id, 10);
    const surahNum = parseInt(req.params.surah, 10);

    if (Number.isNaN(reciterId)) return fail(reply, 400, 'Invalid reciter id');
    if (Number.isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
        return fail(reply, 400, 'Invalid surah number. Must be between 1 and 114');
    }

    try {
        const data = await getRadioContent();
        const reciter = data.reciters.find((r) => r.id === reciterId);

        if (!reciter) return fail(reply, 404, 'Reciter not found');
        if (!reciter.moshaf || reciter.moshaf.length === 0) {
            return fail(reply, 404, 'No moshaf available for this reciter');
        }

        const moshafItem = reciter.moshaf[0];
        if (!moshafItem?.server) return fail(reply, 404, 'Server information not available for this reciter');

        const surah = surahNum.toString().padStart(3, '0');
        const audio = `${moshafItem.server}${surah}.mp3`;

        return ok(reply, {
            reciter: reciter.name,
            surah: surahNum,
            audio,
        });
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getReciterByName(req: FastifyRequest<{ Querystring: { name?: string } }>, reply: FastifyReply) {
    const name = req.query.name?.trim();
    if (!name) return fail(reply, 400, 'Query parameter "name" is required');

    try {
        const data = await getRadioContent();
        const search = normalizeArabic(name);
        const matches = data.reciters.filter((r) => normalizeArabic(r.name).includes(search));

        if (matches.length === 0) return fail(reply, 404, 'Reciter not found');
        return ok(reply, matches);
    } catch (err) {
        return unavailable(reply, err);
    }
}
