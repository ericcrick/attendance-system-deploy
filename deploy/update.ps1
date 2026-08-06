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

# Native commands (git, yarn, pm2) don't stop the script on failure just
# because $ErrorActionPreference is 'Stop' - that only covers PowerShell's
# own errors. Without this, e.g. a failed `git pull` (network blip, or a
# non-fast-forward history the --ff-only can't reconcile) would leave
# $newHead equal to $oldHead and get reported as "already up to date"
# instead of the failure it actually was.
function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][ScriptBlock]$Command,
        [Parameter(Mandatory = $true)][string]$FailureMessage
    )
    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$FailureMessage (exit code $LASTEXITCODE)"
    }
}

Push-Location $RepoRoot
try {
    Write-Host "==> Fetching update" -ForegroundColor Cyan
    $oldHead = git rev-parse HEAD
    Invoke-Checked { git pull --ff-only } "git pull failed - check network connectivity and that this clone hasn't diverged from origin"
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
            Invoke-Checked { yarn install --production --frozen-lockfile } "yarn install failed"
        }

        Write-Host "==> Applying any pending database migrations" -ForegroundColor Cyan
        Invoke-Checked { yarn migration:run:prod } "Database migration failed - services were NOT reloaded, still running the previous version"
    } finally {
        Pop-Location
    }

    Write-Host "==> Reloading services (rolling, zero-downtime for backend/web)" -ForegroundColor Cyan
    Invoke-Checked { pm2 startOrReload (Join-Path $RepoRoot 'ecosystem.config.js') } "pm2 reload failed - check 'pm2 status' and 'pm2 logs' now"
    pm2 save

    Write-Host "`n==> Status" -ForegroundColor Cyan
    pm2 status

    Write-Host "`nUpdated $oldHead -> $newHead. Check http://localhost/ and 'pm2 logs' if anything looks off." -ForegroundColor Green
    Write-Host "Rollback if needed: git checkout $oldHead -- . ; then re-run this script's reload step (pm2 startOrReload ecosystem.config.js)."
} finally {
    Pop-Location
}
