/*
 * Bonyan-API – Quran & Azkar API
 * Copyright (c) 2026 BonyanOSS
 * MIT License
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { getBook, getHadith, listBooks } from './hadith.service.js';
import { fail, ok, unavailable } from '../../utils/http.js';

export async function getHadithBooks(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const books = await listBooks();
        return ok(reply, books);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getHadithBook(
    req: FastifyRequest<{ Params: { book: string }; Querystring: { from?: string; to?: string } }>,
    reply: FastifyReply,
) {
    const bookId = req.params.book.trim();
    if (!bookId) return fail(reply, 400, 'Book id is required');

    const from = req.query.from ? parseInt(req.query.from, 10) : 1;
    const to = req.query.to ? parseInt(req.query.to, 10) : from + 29;

    if (Number.isNaN(from) || Number.isNaN(to) || from < 1 || to < from) {
        return fail(reply, 400, 'Invalid range. "from" and "to" must be positive integers with from <= to');
    }
    if (to - from > 300) return fail(reply, 400, 'Range cannot exceed 300 hadiths per request');

    try {
        const data = await getBook(bookId, { from, to });
        return ok(reply, data);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getHadithByNumber(req: FastifyRequest<{ Params: { book: string; number: string } }>, reply: FastifyReply) {
    const bookId = req.params.book.trim();
    const number = parseInt(req.params.number, 10);
    if (!bookId) return fail(reply, 400, 'Book id is required');
    if (Number.isNaN(number) || number < 1) return fail(reply, 400, 'Hadith number must be a positive integer');

    try {
        const hadith = await getHadith(bookId, number);
        if (!hadith) return fail(reply, 404, 'Hadith not found');
        return ok(reply, hadith);
    } catch (err) {
        return unavailable(reply, err);
    }
}

export async function getRandomHadith(req: FastifyRequest<{ Querystring: { book?: string } }>, reply: FastifyReply) {
    try {
        const books = await listBooks();
        if (books.length === 0) return fail(reply, 503, 'No hadith books available');

        const targetBook = req.query.book ? books.find((b) => b.id === req.query.book) : books[Math.floor(Math.random() * books.length)];
        if (!targetBook) return fail(reply, 404, 'Book not found');

        const number = Math.floor(Math.random() * targetBook.available) + 1;
        const hadith = await getHadith(targetBook.id, number);
        if (!hadith) return fail(reply, 503, 'Could not fetch a random hadith');
        return ok(reply, { book: targetBook.name, hadith });
    } catch (err) {
        return unavailable(reply, err);
    }
}
