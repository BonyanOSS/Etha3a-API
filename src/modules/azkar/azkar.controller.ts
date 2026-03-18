/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 RlxChap2 and kremdev
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getAzkar } from './azkar.service.js';
import { AzkarCategory } from '@/src/types/Items.js';

export async function getAllAzkar(req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = getAzkar();
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(404).send({
            success: false,
            message: (err as Error).message,
        });
    }
}

export async function getZekrByCategory(req: FastifyRequest<{ Params: { category: string } }>, reply: FastifyReply) {
    try {
        const category = AzkarCategory[req.params.category as keyof typeof AzkarCategory];
        if (!category) return reply.status(404).send({ success: false, message: 'Category not found' });

        const azkar = getAzkar();
        const data = azkar.find((a) => a.category === category);
        return reply.send({ success: true, data });
    } catch (err) {
        return reply.status(404).send({
            success: false,
            message: (err as Error).message,
        });
    }
}
