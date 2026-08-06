<#
.SYNOPSIS
  Run THIS ON THE TARGET MACHINE, from inside the deploy repo clone, every
  time you want to roll out a new release. Zero-downtime for backend/web;
  fingerprint-matcher and caddy only restart if their own files changed.

.EXAMPLE
  cd C:\attendance-app\deploy-repo
  .\deploy\update.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot   # deploy repo root (this script lives in deploy\)

Push-Location $RepoRoot
try {
    Write-Host "==> Fetching update" -ForegroundColor Cyan
    $oldHead = git rev-parse HEAD
    git pull --ff-only
    $newHead = git rev-parse HEAD

    if ($oldHead -eq $newHead) {
        Write-Host "Already up to date ($newHead). Nothing to reload." -ForegroundColor Yellow
        return
    }

    $changedFiles = git diff --name-only $oldHead $newHead

    Push-Location (Join-Path $RepoRoot 'backend')
    try {
        if ($changedFiles -match '^backend/(package\.json|yarn\.lock)$') {
            Write-Host "==> backend dependencies changed, reinstalling (production only)" -ForegroundColor Cyan
            yarn install --production --frozen-lockfile
        }

        Write-Host "==> Applying any pending database migrations" -ForegroundColor Cyan
        yarn migration:run:prod
    } finally {
        Pop-Location
    }

    Write-Host "==> Reloading services (rolling, zero-downtime for backend/web)" -ForegroundColor Cyan
    pm2 startOrReload (Join-Path $RepoRoot 'ecosystem.config.js')
    pm2 save

    Write-Host "`n==> Status" -ForegroundColor Cyan
    pm2 status

    Write-Host "`nUpdated $oldHead -> $newHead. Check http://localhost/ and 'pm2 logs' if anything looks off." -ForegroundColor Green
    Write-Host "Rollback if needed: git checkout $oldHead -- . ; then re-run this script's reload step (pm2 startOrReload ecosystem.config.js)."
} finally {
    Pop-Location
}
