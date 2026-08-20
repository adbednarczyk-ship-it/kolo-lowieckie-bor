#Requires -Version 5.1
<#
.SYNOPSIS
  Pierwsze publikowanie: GitHub repo + push + wdrożenie na Vercel.

.DESCRIPTION
  Logowanie do GitHub i Vercel jest jednorazowe (otworzy przeglądarkę).
  Potem wystarczy: git add / commit / push — Vercel sam wdraża produkcję.
#>
$ErrorActionPreference = "Stop"

function Refresh-Path {
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [System.Environment]::GetEnvironmentVariable("Path", "User")
}

function Ensure-Command([string]$Name, [string]$WingetId) {
  if (Get-Command $Name -ErrorAction SilentlyContinue) { return }
  Write-Host "Instaluję $Name..." -ForegroundColor Yellow
  winget install $WingetId --accept-package-agreements --accept-source-agreements --disable-interactivity
  Refresh-Path
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name nie jest w PATH. Zamknij terminal, otwórz nowy i uruchom skrypt ponownie."
  }
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Refresh-Path

$repoName = "kolo-lowieckie-bor"
$visibility = if ($env:GITHUB_REPO_PRIVATE -eq "false") { "--public" } else { "--private" }

Write-Host "`n=== 1/4  GitHub CLI ===" -ForegroundColor Cyan
Ensure-Command "gh" "GitHub.cli"
Ensure-Command "git" "Git.Git"

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Zaloguj się do GitHub (otworzy się przeglądarka)..." -ForegroundColor Yellow
  gh auth login --web --git-protocol https
}

Write-Host "`n=== 2/4  Repozytorium GitHub ===" -ForegroundColor Cyan
$remote = git remote get-url origin 2>$null
if (-not $remote) {
  gh repo create $repoName $visibility --source=. --remote=origin --push
  if ($LASTEXITCODE -ne 0) { throw "Nie udało się utworzyć repozytorium." }
} else {
  Write-Host "Remote origin już istnieje: $remote"
  git push -u origin main
}

$origin = git remote get-url origin
Write-Host "Repo: $origin" -ForegroundColor Green

Write-Host "`n=== 3/4  Vercel CLI ===" -ForegroundColor Cyan
npx --yes vercel --version | Out-Null

Write-Host "`n=== 4/4  Wdrożenie produkcyjne ===" -ForegroundColor Cyan
Write-Host "Jeśli to pierwsze logowanie, Vercel otworzy przeglądarkę." -ForegroundColor Yellow

npx --yes vercel link --yes
if ($LASTEXITCODE -ne 0) { throw "Nie udało się podpiąć projektu Vercel." }

npx --yes vercel --prod --yes
if ($LASTEXITCODE -ne 0) { throw "Wdrożenie Vercel nie powiodło się." }

Write-Host @"

Gotowe.

Od tej pory publikacja wygląda tak:

  git add .
  git commit -m "Opis zmiany"
  git push

Vercel sam zbuduje i wdroży produkcję po każdym pushu na main.
Podgląd (preview) powstaje automatycznie dla pull requestów,
jeśli projekt jest importowany z GitHuba na vercel.com/new.

"@ -ForegroundColor Green
