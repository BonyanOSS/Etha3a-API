# Sources and Licenses

Bonyan-API normalizes public upstream data into stable response shapes. Each source should be reviewed for license, availability, and terms before being used in production.

| Area        | Source                                   | Usage                                    |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| Surah index | `mp3quran.net`                           | Primary surah metadata                   |
| Surah index | `alquran.cloud`                          | Fallback surah metadata                  |
| Surah index | `quran.com`                              | Fallback surah metadata                  |
| Quran text  | `alquran.cloud`                          | Primary Uthmani Quran text               |
| Quran text  | `cdn.jsdelivr.net/fawazahmed0/quran-api` | Fallback Quran text mirror               |
| Reciters    | `mp3quran.net`                           | Primary reciter and moshaf data          |
| Reciters    | `quran.com`                              | Fallback recitation data                 |
| Tafsir      | `alquran.cloud`                          | Edition-specific tafsir                  |
| Tafsir      | `quranenc.com`                           | Edition-specific tafsir fallback         |
| Azkar       | `github.com/nawafalqari/azkar-api`       | Primary azkar dataset                    |
| Azkar       | `hisnmuslim.com`                         | Fallback azkar dataset                   |
| Hadith      | `api.hadith.gading.dev`                  | Primary hadith books and ranges          |
| Hadith      | `cdn.jsdelivr.net/sutanlab/hadith-api`   | Fallback hadith dataset mirror           |
| Prayer      | `api.aladhan.com`                        | Prayer times and Hijri conversion        |
| Prayer      | `api.pray.zone`                          | Same-day prayer fallback for coordinates |
| Qibla       | `api.aladhan.com`                        | Primary Qibla direction                  |
| Qibla       | Local calculation                        | Offline fallback direction               |

Before adding a source, document:

- Official URL and maintainer.
- License or terms.
- Timeout and payload size.
- Data differences from existing sources.
- Canonical mapping and `apiName`.
