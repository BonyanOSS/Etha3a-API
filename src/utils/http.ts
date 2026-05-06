/*
 * Etha3a – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply } from 'fastify';

export interface OkBody<T> {
    success: true;
    data: T;
}

export interface FailBody {
    success: false;
    message: string;
}

export function ok<T>(reply: FastifyReply, data: T, status = 200): FastifyReply {
    return reply.status(status).send({ success: true, data } satisfies OkBody<T>);
}

export function fail(reply: FastifyReply, status: number, message: string): FastifyReply {
    return reply.status(status).send({ success: false, message } satisfies FailBody);
}

export function unavailable(reply: FastifyReply, err: unknown): FastifyReply {
    const message = err instanceof Error && err.message ? err.message : 'No APIs available';
    return fail(reply, 503, message);
}
