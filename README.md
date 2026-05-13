<div align="center">

# Bonyan-API

[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/-Fastify-000000?logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-69%20passing-brightgreen)](#testing)
[![docs](https://img.shields.io/badge/docs-bonyanoss-007bff)](https://docs.bonyanoss.org/etha3a)
[![website](https://img.shields.io/badge/website-bonyanoss-007bff)](https://bonyanoss.org)

<br />

_A unified Islamic API: Quran, Tafsir, Azkar, Hadith, Prayer Times, Hijri Date, and Qibla — with automatic multi-source fallback._

_Please select your preferred language below / الرجاء اختيار لغتك المفضلة بالأسفل_

</div>

---

<details open>
  <summary><h2>English Version</h2></summary>

### Description

**Bonyan-API** is an enterprise-grade, high-performance API built with **Node.js**, **Fastify**, and **TypeScript**. It exposes a unified, type-safe data interface for every kind of Islamic digital content a modern web, mobile, or desktop application might need: full Quran text, audio recitations, Tafsir, Azkar (supplications), Hadith, prayer times, Hijri/Gregorian date conversion, and Qibla direction.

Every module is engineered around a single core idea: **resilience through fallback**. If a primary upstream source goes down, the API transparently retries against the next configured provider, returning a consistent shape to the client. Frequently-fetched data is memoized in-process to keep latency low and reduce load on third-party services.

### Key Features

- **Multi-source fallback** — every endpoint has 2+ upstream providers; if one fails (timeout, 5xx, malformed response, empty result), the next is tried automatically.
- **In-process caching** — results are memoized with per-endpoint TTLs and concurrent calls are coalesced into a single upstream request.
- **Request timeouts** — every upstream call is wrapped in `AbortController` so a slow source can't hang your server.
- **Rate limiting** — built-in per-IP rate limit (configurable via `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW`).
- **Type-safe** — written in strict TypeScript with `noUncheckedIndexedAccess` enabled.
- **Modular architecture** — each domain (`ayat`, `surah`, `reciters`, `azkar`, `tafsir`, `hadith`, `prayer`, `hijri`, `qibla`) lives in its own `route.ts` / `controller.ts` / `service.ts` triplet.
- **Container-ready** — multi-stage `DOCKERFILE` produces a minimal `node:20-alpine` runtime image.
- **CI/CD enforced** — pull requests must pass ESLint, `tsc`, and Vitest before merge.

### Modules & Endpoints

The root `GET /` returns a JSON catalogue of every registered route. `GET /health` returns liveness info.

#### Quran — Surah index — `/surah`

| Method | Path                         | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/surah`                     | Full list of all 114 surahs  |
| GET    | `/surah/:id`                 | A single surah by id (1–114) |
| GET    | `/surah/search?name=الفاتحة` | Search surah by Arabic name  |

**Fallback sources:** `mp3quran.net` → `alquran.cloud` → `quran.com`

#### Quran — Ayat (verses) — `/ayat`

| Method | Path                              | Description                                                 |
| ------ | --------------------------------- | ----------------------------------------------------------- |
| GET    | `/ayat`                           | The full Quran text (cached for 24h)                        |
| GET    | `/ayat/:id`                       | A single aya by absolute number (1–6236)                    |
| GET    | `/ayat/:surah/aya/:id`            | A single aya by surah + verse-in-surah                      |
| GET    | `/ayat/search?text=الله&limit=50` | Search ayat by text (Arabic-normalized, ignores diacritics) |

**Fallback sources:** `alquran.cloud` (Uthmani) → `cdn.jsdelivr.net/gh/fawazahmed0/quran-api`

#### Reciters & audio — `/reciters`

| Method | Path                         | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| GET    | `/reciters`                  | All reciters with their available moshafs     |
| GET    | `/reciters/:id`              | A single reciter                              |
| GET    | `/reciters/search?name=...`  | Search reciter by Arabic name                 |
| GET    | `/reciters/:id/surah/:surah` | Resolve audio URL for a given reciter + surah |

**Fallback sources:** `mp3quran.net` → `quran.com`

#### Tafsir (exegesis) — `/tafsir`

| Method | Path                            | Description                                                                    |
| ------ | ------------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/tafsir`                       | List supported editions (`muyassar`, `jalalayn`, `saadi`, `waseet`, `qurtubi`) |
| GET    | `/tafsir/:edition/:surah`       | Tafsir for a whole surah                                                       |
| GET    | `/tafsir/:edition/:surah/:aya`  | Tafsir for a single aya                                                        |
| GET    | `/tafsir/:edition/:surah?aya=N` | Same, with the aya as a query param                                            |

**Fallback sources:** `alquran.cloud` → `quranenc.com`

#### Azkar (supplications) — `/azkar`

| Method | Path                              | Description                                                  |
| ------ | --------------------------------- | ------------------------------------------------------------ |
| GET    | `/azkar`                          | All available categories (morning, evening, after prayer, …) |
| GET    | `/azkar/:category`                | Items inside a category                                      |
| GET    | `/azkar/random`                   | A random zekr                                                |
| GET    | `/azkar/search?text=...&limit=50` | Search across all azkar                                      |

**Fallback sources:** `nawafalqari/azkar-api` (GitHub) → `hisnmuslim.com`

#### Hadith — `/hadith`

| Method | Path                          | Description                                                    |
| ------ | ----------------------------- | -------------------------------------------------------------- |
| GET    | `/hadith`                     | List of available hadith books (Bukhari, Muslim, Abu-Dawud, …) |
| GET    | `/hadith/:book?from=1&to=30`  | Hadith range from a book (max 300 per request)                 |
| GET    | `/hadith/:book/:number`       | A single hadith by its number                                  |
| GET    | `/hadith/random?book=bukhari` | A random hadith (optionally scoped to a book)                  |

**Fallback sources:** `api.hadith.gading.dev` → `cdn.jsdelivr.net/gh/sutanlab/hadith-api`

#### Prayer Times — `/prayer/times`

| Method | Path                                                                | Description                        |
| ------ | ------------------------------------------------------------------- | ---------------------------------- |
| GET    | `/prayer/times?latitude=21.4225&longitude=39.8262`                  | Today's timings for coordinates    |
| GET    | `/prayer/times?city=Mecca&country=SA`                               | Today's timings by city/country    |
| GET    | `/prayer/times?date=06-05-2026&latitude=...&longitude=...&method=4` | Custom date and calculation method |

**Fallback sources:** `api.aladhan.com/timings` → `api.aladhan.com/timingsByCity` → `api.pray.zone`

#### Hijri ↔ Gregorian — `/hijri`

| Method | Path                                    | Description                       |
| ------ | --------------------------------------- | --------------------------------- |
| GET    | `/hijri/today`                          | Today's date in both calendars    |
| GET    | `/hijri/from-gregorian?date=06-05-2026` | Convert a gregorian date to hijri |
| GET    | `/hijri/to-gregorian?date=18-11-1447`   | Convert a hijri date to gregorian |

**Fallback sources:** `api.aladhan.com/gToH` ↔ `api.aladhan.com/hToG`

#### Qibla — `/qibla`

| Method | Path                                        | Description                                   |
| ------ | ------------------------------------------- | --------------------------------------------- |
| GET    | `/qibla?latitude=24.7136&longitude=46.6753` | Compass bearing (in degrees) toward the Kaaba |

**Fallback sources:** `api.aladhan.com/qibla` → local great-circle computation (always succeeds)

### Tech Stack

- **Runtime:** Node.js (v20+ recommended)
- **Language:** TypeScript (strict, `NodeNext` modules)
- **Framework:** Fastify 5
- **Plugins:** `@fastify/cors`, `@fastify/rate-limit`
- **Tooling:** ESLint 10, Prettier, Vitest, tsx, dotenv
- **Package Manager:** pnpm

### Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/) 20.x or higher
- [pnpm](https://pnpm.io/) 10.x or higher
- [Docker](https://www.docker.com/) (optional)

#### Local development

```bash
git clone https://github.com/BonyanOSS/Bonyan-API.git
cd Bonyan-API
pnpm install
cp .env.example .env       # adjust PORT / RATE_LIMIT_* if needed
pnpm dev                   # starts Fastify with hot-reload via tsx watch
```

The server prints all registered routes on startup. Open `http://localhost:3000/` for the live route catalogue.

#### Production build

```bash
pnpm lint                  # eslint --fix + prettier
pnpm build                 # tsc → dist/
pnpm start                 # node dist/server.js
```

#### Environment variables

| Variable            | Default      | Purpose                                                  |
| ------------------- | ------------ | -------------------------------------------------------- |
| `PORT`              | `3000`       | HTTP listen port                                         |
| `HOST`              | `0.0.0.0`    | Bind address                                             |
| `NODE_ENV`          | `production` | Logging / framework behavior                             |
| `RATE_LIMIT_MAX`    | `120`        | Max requests per window per IP                           |
| `RATE_LIMIT_WINDOW` | `1 minute`   | Rate-limit time window (parsed by `@fastify/rate-limit`) |

#### Docker

```bash
docker build -t bonyan-api .
docker run -p 3000:3000 --env-file .env bonyan-api
```

### Testing

```bash
pnpm test                  # full vitest run (69 tests)
pnpm test:watch            # interactive watch mode
pnpm test:coverage         # generates coverage/lcov.info
```

Tests exercise:

- The shared `runWithFallback` and `memoize` utilities (mocked).
- Each module's controller — input validation, error shapes, status codes.
- Live integration smoke tests that tolerate `200`, `404`, or `503` so the suite stays green even when an upstream is rate-limited or temporarily unreachable.

### Project structure

```
src/
  server.ts                 # Fastify bootstrap, plugins, route registration
  modules/
    ayat/                   # full Quran text + search
    surah/                  # surah index
    reciters/               # reciter directory + audio resolver
    azkar/                  # supplications (categories, random, search)
    tafsir/                 # multi-edition tafsir
    hadith/                 # 9-books hadith index + lookup
    prayer/                 # daily prayer timings
    hijri/                  # hijri ↔ gregorian conversion
    qibla/                  # qibla direction (with offline fallback)
  utils/
    fallback.ts             # runWithFallback + fetchWithTimeout
    cache.ts                # in-memory memoize with TTL + concurrent-call coalescing
    arabic.ts               # Arabic-text normalization for search
    http.ts                 # standard ok / fail / unavailable responders
  types/
    Api.ts                  # upstream payload shapes
    Items.ts                # canonical client-facing shapes
tests/                      # vitest specs
.github/workflows/          # CI pipelines (lint, build, test, coverage)
DOCKERFILE                  # multi-stage production image
```

### Contributing

We welcome contributions! Direct pushes to `main` are blocked — every change must go through a Pull Request, and CI must pass (ESLint + `tsc` + Vitest with coverage upload).

1. **Fork** the repository and clone your fork.
2. **Create** a feature branch: `git checkout -b feature/your-feature`.
3. **Lint** your code: `pnpm lint`.
4. **Test** your code: `pnpm test`.
5. **Commit** using conventional messages: `git commit -m 'feat(azkar): add evening category alias'`.
6. **Push** and open a PR against `main`.

When you add a new upstream source, please:

- Wrap it with `fetchWithTimeout` so it can't hang the server.
- Map its payload to the canonical type in `src/types/Items.ts`.
- Add it as a fallback inside the existing service rather than creating a parallel pipeline.

### License

This software is released under the [MIT License](./LICENSE).

</details>

---

<details dir="rtl">
  <summary><h2>النسخة العربية</h2></summary>

### وصف المشروع

**Bonyan-API** هي واجهة برمجة تطبيقات إسلامية متكاملة وعالية الأداء، مبنية على **Node.js** و **Fastify** و **TypeScript**. توفّر واجهة بيانات موحّدة وآمنة النوع لكل ما يحتاجه التطبيق الإسلامي الحديث من محتوى رقمي: نص القرآن الكريم كاملاً، التلاوات الصوتية، التفسير، الأذكار، الأحاديث، مواقيت الصلاة، التحويل بين التاريخ الهجري والميلادي، واتجاه القبلة.

كل وحدة في المشروع مبنية حول فكرة جوهرية واحدة: **المرونة من خلال البدائل (Fallback)**. عند تعطّل المصدر الأساسي، يتنقّل النظام تلقائياً إلى المصدر التالي ضمن قائمة موثّقة من المزوّدين، ويُرجع للعميل نفس الشكل الموحّد دائماً. كما تُخزَّن النتائج المتكررة في الذاكرة لتقليل زمن الاستجابة وتخفيف الضغط على المصادر الخارجية.

### المميزات الرئيسية

- **بدائل متعددة لكل نقطة نهاية** — كل endpoint مدعوم بأكثر من مزوّد، وفي حال فشل أحدها (timeout / 5xx / استجابة فارغة) يُحاوَل التالي تلقائياً.
- **Cache داخلي** — كل بيانات يتم جلبها تُحفظ في الذاكرة مع TTL مخصّص، والطلبات المتزامنة تُدمَج في طلب واحد.
- **مهلة لكل طلب خارجي** — يُلفّ كل fetch بـ `AbortController` لمنع تعليق الخادم بسبب مصدر بطيء.
- **تحديد معدّل الطلبات (Rate Limit)** — مدمج عبر `@fastify/rate-limit` (قابل للتعديل عبر متغيرات البيئة).
- **آمن النوع (Type-Safe)** — مكتوب بالكامل في TypeScript مع `strict` و `noUncheckedIndexedAccess`.
- **بنية تركيبية** — كل وحدة في مجلدها الخاص (`route.ts` / `controller.ts` / `service.ts`).
- **جاهز للحاويات** — `DOCKERFILE` متعدد المراحل ينتج صورة `node:20-alpine` خفيفة.
- **CI/CD صارم** — كل PR يجب أن يجتاز ESLint وبناء TypeScript واختبارات Vitest.

### الوحدات ونقاط النهاية

`GET /` يُرجع قائمة بكل المسارات المسجّلة. `GET /health` يُرجع حالة الخادم.

#### السور — `/surah`

| Method | Path                         | الوصف              |
| ------ | ---------------------------- | ------------------ |
| GET    | `/surah`                     | كل السور الـ 114   |
| GET    | `/surah/:id`                 | سورة محددة (1–114) |
| GET    | `/surah/search?name=الفاتحة` | بحث بالاسم العربي  |

**البدائل:** `mp3quran.net` → `alquran.cloud` → `quran.com`

#### الآيات — `/ayat`

| Method | Path                              | الوصف                                              |
| ------ | --------------------------------- | -------------------------------------------------- |
| GET    | `/ayat`                           | كل القرآن (مُخزَّن لمدة 24 ساعة)                   |
| GET    | `/ayat/:id`                       | آية برقمها المطلق (1–6236)                         |
| GET    | `/ayat/:surah/aya/:id`            | آية برقم السورة + ترتيبها داخلها                   |
| GET    | `/ayat/search?text=الله&limit=50` | بحث في النص (يتجاهل التشكيل والاختلافات الإملائية) |

**البدائل:** `alquran.cloud` (المصحف العثماني) → `cdn.jsdelivr.net/gh/fawazahmed0/quran-api`

#### القرّاء والصوتيات — `/reciters`

| Method | Path                         | الوصف                         |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/reciters`                  | كل القرّاء مع المصاحف المتاحة |
| GET    | `/reciters/:id`              | قارئ محدد                     |
| GET    | `/reciters/search?name=...`  | بحث القارئ بالاسم             |
| GET    | `/reciters/:id/surah/:surah` | رابط الصوت لقارئ + سورة       |

**البدائل:** `mp3quran.net` → `quran.com`

#### التفسير — `/tafsir`

| Method | Path                           | الوصف                                                                     |
| ------ | ------------------------------ | ------------------------------------------------------------------------- |
| GET    | `/tafsir`                      | الإصدارات المدعومة (`muyassar`, `jalalayn`, `saadi`, `waseet`, `qurtubi`) |
| GET    | `/tafsir/:edition/:surah`      | تفسير سورة كاملة                                                          |
| GET    | `/tafsir/:edition/:surah/:aya` | تفسير آية واحدة                                                           |

**البدائل:** `alquran.cloud` → `quranenc.com`

#### الأذكار — `/azkar`

| Method | Path                     | الوصف                                              |
| ------ | ------------------------ | -------------------------------------------------- |
| GET    | `/azkar`                 | كل التصنيفات (الصباح، المساء، أذكار بعد الصلاة، …) |
| GET    | `/azkar/:category`       | عناصر تصنيف معين                                   |
| GET    | `/azkar/random`          | ذكر عشوائي                                         |
| GET    | `/azkar/search?text=...` | بحث في كل الأذكار                                  |

**البدائل:** `nawafalqari/azkar-api` (GitHub) → `hisnmuslim.com`

#### الأحاديث — `/hadith`

| Method | Path                          | الوصف                                      |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/hadith`                     | الكتب المتاحة (البخاري، مسلم، أبو داود، …) |
| GET    | `/hadith/:book?from=1&to=30`  | جلب نطاق من الأحاديث                       |
| GET    | `/hadith/:book/:number`       | حديث محدد برقمه                            |
| GET    | `/hadith/random?book=bukhari` | حديث عشوائي                                |

**البدائل:** `api.hadith.gading.dev` → `cdn.jsdelivr.net/gh/sutanlab/hadith-api`

#### مواقيت الصلاة — `/prayer/times`

| Method | Path                                               | الوصف                         |
| ------ | -------------------------------------------------- | ----------------------------- |
| GET    | `/prayer/times?latitude=21.4225&longitude=39.8262` | مواقيت اليوم بالإحداثيات      |
| GET    | `/prayer/times?city=Mecca&country=SA`              | مواقيت اليوم بالمدينة والدولة |
| GET    | `/prayer/times?date=06-05-2026&...&method=4`       | تاريخ مخصص + طريقة حساب       |

**البدائل:** `api.aladhan.com/timings` → `timingsByCity` → `api.pray.zone`

#### الهجري ↔ الميلادي — `/hijri`

| Method | Path                                    | الوصف                  |
| ------ | --------------------------------------- | ---------------------- |
| GET    | `/hijri/today`                          | تاريخ اليوم بالتقويمين |
| GET    | `/hijri/from-gregorian?date=06-05-2026` | ميلادي → هجري          |
| GET    | `/hijri/to-gregorian?date=18-11-1447`   | هجري → ميلادي          |

**البدائل:** `api.aladhan.com/gToH` ↔ `api.aladhan.com/hToG`

#### القبلة — `/qibla`

| Method | Path                                        | الوصف                 |
| ------ | ------------------------------------------- | --------------------- |
| GET    | `/qibla?latitude=24.7136&longitude=46.6753` | اتجاه القبلة بالدرجات |

**البدائل:** `api.aladhan.com/qibla` → حساب محلي بصيغة الدائرة العظمى (لا يفشل أبداً)

### التقنيات المستخدمة

- **بيئة التشغيل:** Node.js (يُنصح بالإصدار 20 فما فوق)
- **اللغة:** TypeScript
- **إطار العمل:** Fastify 5
- **الإضافات:** `@fastify/cors`، `@fastify/rate-limit`
- **الأدوات:** ESLint 10، Prettier، Vitest، tsx، dotenv
- **مدير الحزم:** pnpm

### دليل التشغيل

#### المتطلبات

- [Node.js](https://nodejs.org/) إصدار 20 أو أحدث
- [pnpm](https://pnpm.io/) إصدار 10 أو أحدث
- [Docker](https://www.docker.com/) (اختياري)

#### التشغيل المحلي

```bash
git clone https://github.com/BonyanOSS/Bonyan-API.git
cd Bonyan-API
pnpm install
cp .env.example .env
pnpm dev
```

#### الإنتاج

```bash
pnpm lint
pnpm build
pnpm start
```

#### المتغيرات البيئية

| المتغير             | القيمة الافتراضية | الوصف                      |
| ------------------- | ----------------- | -------------------------- |
| `PORT`              | `3000`            | منفذ HTTP                  |
| `HOST`              | `0.0.0.0`         | عنوان الربط                |
| `NODE_ENV`          | `production`      | بيئة التشغيل               |
| `RATE_LIMIT_MAX`    | `120`             | الحد الأقصى للطلبات لكل IP |
| `RATE_LIMIT_WINDOW` | `1 minute`        | نافذة تحديد المعدّل        |

#### Docker

```bash
docker build -t bonyan-api .
docker run -p 3000:3000 --env-file .env bonyan-api
```

### الاختبارات

```bash
pnpm test                  # 69 اختبار
pnpm test:watch            # وضع المراقبة
pnpm test:coverage         # مع تقرير التغطية
```

### الشراكة والمساهمة

نُرحّب بأي مساهمة! الدفع المباشر للفرع `main` ممنوع — يجب أن تمر كل مساهمة عبر Pull Request، وأن تجتاز خطوط CI.

1. اعمل **Fork** للمستودع وانسخه محلياً.
2. أنشئ فرعاً للميزة الجديدة: `git checkout -b feature/your-feature`.
3. شغّل ESLint: `pnpm lint`.
4. شغّل الاختبارات: `pnpm test`.
5. أنشئ commit بصيغة Conventional: `git commit -m 'feat(azkar): إضافة تصنيف جديد'`.
6. ادفع التغييرات وافتح PR على فرع `main`.

عند إضافة مصدر جديد:

- استخدم `fetchWithTimeout` حتى لا يُعلِّق المصدر البطيء الخادم.
- حوّل بيانات المصدر إلى الشكل الموحّد في `src/types/Items.ts`.
- أضفه كـ fallback ضمن الـ service الموجود بدلاً من إنشاء مسار مستقل.

### الترخيص

هذا المشروع مُرخَّص بموجب [رخصة MIT](./LICENSE).

</details>
