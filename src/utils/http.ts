/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply } from 'fastify';

export interface OkBody<T> {
    success: true;
    data: T;
}

export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'RATE_LIMITED' | 'ALL_SOURCES_FAILED' | 'INTERNAL_SERVER_ERROR';

export interface FailBody {
    success: false;
    message: string;
    error: {
        code: ErrorCode;
        message: string;
        requestId: string;
    };
}

export function ok<T>(reply: FastifyReply, data: T, status = 200): FastifyReply {
    return reply.status(status).send({ success: true, data } satisfies OkBody<T>);
}

export function fail(reply: FastifyReply, status: number, message: string, code = codeForStatus(status)): FastifyReply {
    return reply.status(status).send({
        success: false,
        message,
        error: {
            code,
            message,
            requestId: String(reply.request.id),
        },
    } satisfies FailBody);
}

export function unavailable(reply: FastifyReply, err: unknown): FastifyReply {
    reply.log.warn({ err }, 'All upstream sources failed');
    return fail(reply, 503, 'All upstream sources are unavailable', 'ALL_SOURCES_FAILED');
}

function codeForStatus(status: number): ErrorCode {
    if (status === 404) return 'NOT_FOUND';
    if (status === 429) return 'RATE_LIMITED';
    if (status >= 400 && status < 500) return 'BAD_REQUEST';
    return 'INTERNAL_SERVER_ERROR';
}
