# Koło Łowieckie „Bór”

Nowoczesna strona internetowa koła łowieckiego: Next.js 15 (App Router), TypeScript, Tailwind CSS i Framer Motion.

Strona jest w pełni responsywna, zoptymalizowana pod SEO i gotowa do wdrożenia na Vercel.

## Stack

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zdjęcia: Unsplash (zdalnie, przez `next/image`)

## Wymagania

- Node.js 18.18+ (zalecane 20 LTS lub nowszy)
- npm
- Konto [GitHub](https://github.com) i [Vercel](https://vercel.com)

## Uruchomienie lokalne

```bash
git clone https://github.com/TWOJ_LOGIN/kolo-lowieckie-bor.git
cd kolo-lowieckie-bor
npm install
copy .env.example .env.local
npm run dev
```

Na macOS/Linux zamiast `copy` użyj `cp .env.example .env.local`.

Otwórz [http://localhost:3000](http://localhost:3000).

### Skrypty

| Komenda        | Opis                          |
| -------------- | ----------------------------- |
| `npm run dev`  | serwer deweloperski           |
| `npm run build`| produkcyjny build             |
| `npm run start`| uruchomienie buildu           |
| `npm run lint` | ESLint                        |

## Personalizacja

Najłatwiej zmienić nazwę koła, adres i treści w jednym miejscu:

- `src/data/content.ts` — nazwa, zarząd, polowania, galeria, aktualności, członkostwo
- `src/lib/site.ts` — bazowy URL strony
- `.env.local` — `NEXT_PUBLIC_SITE_URL`

Po podpięciu poczty w `src/app/api/contact/route.ts` formularz może wysyłać wiadomości (Resend, Nodemailer, webhook). Domyślnie zgłoszenia są walidowane i logowane po stronie serwera.

## Wdrożenie na GitHub i Vercel

### 1. Utwórz repozytorium na GitHub

1. Zaloguj się na [github.com/new](https://github.com/new).
2. Nazwa: `kolo-lowieckie-bor`.
3. Widoczność: Public lub Private.
4. **Nie** dodawaj README, `.gitignore` ani licencji (projekt już je ma).
5. Kliknij **Create repository**.

### 2. Wypchnij kod

W katalogu projektu (PowerShell):

```powershell
git init
git add .
git commit -m "Initial commit: strona Kola Lowieckiego Bor"
git branch -M main
git remote add origin https://github.com/TWOJ_LOGIN/kolo-lowieckie-bor.git
git push -u origin main
```

Jeśli GitHub CLI jest zainstalowane:

```powershell
gh repo create kolo-lowieckie-bor --private --source=. --remote=origin --push
```

### 3. Podłącz Vercel

1. Wejdź na [vercel.com/new](https://vercel.com/new) i zaloguj się kontem GitHub.
2. Wybierz repozytorium `kolo-lowieckie-bor`.
3. Framework: **Next.js** (wykrywany automatycznie).
4. Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://kolo-lowieckie-bor.vercel.app`  
     (po podpięciu własnej domeny zmień na `https://twojadomena.pl`)
5. Kliknij **Deploy**.

Każdy push do `main` uruchomi kolejne wdrożenie.

### 4. Własna domena (opcjonalnie)

1. W projekcie Vercel: **Settings → Domains → Add**.
2. Wpisz domenę, np. `klbor.pl` i `www.klbor.pl`.
3. U dostawcy domeny ustaw rekordy, które pokaże Vercel:

**Apex (klbor.pl)**

| Typ | Nazwa | Wartość        |
| --- | ----- | -------------- |
| A   | `@`   | `76.76.21.21`  |

**www**

| Typ | Nazwa | Wartość                     |
| --- | ----- | --------------------------- |
| CNAME | `www` | `cname.vercel-dns.com`    |

4. Po weryfikacji ustaw `NEXT_PUBLIC_SITE_URL=https://klbor.pl` i zrób Redeploy.

## Struktura

```
src/
  app/                 # App Router: strona, SEO, API, OG
  components/          # Header, Hero, sekcje, formularz
  data/content.ts      # Treści po polsku
  lib/site.ts          # URL i format dat
```

## Licencja

Kod strony możesz swobodnie wykorzystać na potrzeby koła. Zdjęcia z Unsplash podlegają [Unsplash License](https://unsplash.com/license).
