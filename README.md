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
| `npm run publish:site` | pierwsze publikowanie (GitHub + Vercel) |

## Personalizacja

Najłatwiej zmienić nazwę koła, adres i treści w jednym miejscu:

- `src/data/content.ts` — nazwa, zarząd, polowania, galeria, aktualności, członkostwo
- `src/lib/site.ts` — bazowy URL strony
- `.env.local` — `NEXT_PUBLIC_SITE_URL`

Po podpięciu poczty w `src/app/api/contact/route.ts` formularz może wysyłać wiadomości (Resend, Nodemailer, webhook). Domyślnie zgłoszenia są walidowane i logowane po stronie serwera.

## Logowanie (Supabase)

Konta zakłada tylko administrator. Publiczna rejestracja jest wyłączona.

1. Utwórz projekt na [supabase.com](https://supabase.com) (plan Free).
2. **SQL Editor** → wklej `supabase/schema.sql` → **Run**.
3. **Authentication → Providers → Email** → wyłącz *Allow new users to sign up*.
4. **Authentication → Users → Add user** → e-mail i hasło (pierwszy administrator).
5. W SQL Editor:

```sql
update public.profiles set role = 'admin', full_name = 'Twoje Imię' where email = 'twoj@email.pl';
```

6. **Project Settings → API** skopiuj `Project URL` i `anon public`.
7. Lokalnie: `copy .env.example .env.local` i wklej klucze.
8. Na Vercel: **Settings → Environment Variables** — te same nazwy:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://….supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | klucz `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | klucz `service_role` (tylko serwer) |

Strony: `/logowanie` (formularz), `/konto` (po zalogowaniu). Trasy `/admin`, `/ksiega-polowan`, `/wiadomosci` wymagają sesji.

## Automatyzacja wdrożenia

Są dwa poziomy. **Logowanie jest tylko raz.** Potem publikacja to zwykły `git push`.

### A. Pierwszy raz — jeden skrypt

W PowerShell, w katalogu projektu:

```powershell
npm run publish:site
```

Skrypt:

1. doinstaluje GitHub CLI, jeśli go nie ma
2. zaloguje Cię do GitHub (przeglądarka)
3. utworzy prywatne repo `kolo-lowieckie-bor` i wypchnie `main`
4. zaloguje do Vercel i wdroży produkcję

Publiczne repo: `$env:GITHUB_REPO_PRIVATE="false"; npm run publish:site`

### B. Na co dzień — push = nowa wersja strony

Najwygodniej **raz** spiąć repo z Vercel przez GitHub (to daje też podgląd pull requestów):

1. [vercel.com/new](https://vercel.com/new) → import `kolo-lowieckie-bor`
2. zmienna `NEXT_PUBLIC_SITE_URL` = adres produkcji
3. Deploy

Od tej pory:

```powershell
git add .
git commit -m "Aktualizacja kalendarza polowań"
git push
```

Vercel sam buduje i wdraża `main`. Pull request dostaje osobny adres podglądu.

CI (lint + build) odpala się automatycznie w GitHub Actions: `.github/workflows/ci.yml`.

### Ręcznie, krok po kroku

Jeśli wolisz klikać bez skryptu:

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
