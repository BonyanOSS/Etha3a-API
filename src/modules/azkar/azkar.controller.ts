/*

 * Etha3a – Quran & Azkar API

 * Copyright (c) 2026 RlxChap2 and kremdev

 * MIT License

 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzkar } from './azkar.service.js';
import { AzkarCategories } from '@/src/types/Items.js';

export async function getZkrByName(req: FastifyRequest<{ Params: { zkr: AzkarCategories } }>, reply: FastifyReply) {
    try {
        const data = await getAzkar(req.params.zkr);
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(503).send({
            success: false,
            message: (err as Error).message || 'No APIs available',
        });
    }
}
