<#
.SYNOPSIS
  ONE-TIME setup for the target Windows 11 desktop. Run as Administrator.
  Installs prerequisites, clones the deploy repo, and gets the stack ready
  to start. Read deploy/README.md alongside this — several steps below are
  interactive (Postgres installer UI, PM2 service account prompt) and can't
  be safely fully unattended.

.PARAMETER DeployRepoUrl
  Git URL of the PRIVATE deploy repo (compiled output only), e.g.
  https://github.com/yourorg/attendance-system-deploy.git

.PARAMETER InstallRoot
  Root folder for everything this app needs. Default C:\attendance-app.

.EXAMPLE
  .\target-setup.ps1 -DeployRepoUrl https://github.com/yourorg/attendance-system-deploy.git
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$DeployRepoUrl,

    [string]$InstallRoot = 'C:\attendance-app'
)

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Pause-ForUser($msg) {
    Write-Host "`n[ACTION NEEDED] $msg" -ForegroundColor Yellow
    Read-Host "Press Enter once done"
}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    throw "Run this from an elevated (Administrator) PowerShell prompt."
}

New-Item -ItemType Directory -Force -Path $InstallRoot | Out-Null
$DeployRepoPath = Join-Path $InstallRoot 'deploy-repo'
$ToolsPath = Join-Path $InstallRoot 'tools'
New-Item -ItemType Directory -Force -Path $ToolsPath | Out-Null

# ---------------------------------------------------------------------------
Step "Installing prerequisites via winget (Node.js LTS, Git, .NET 9 runtime, PostgreSQL 16)"
Write-Host "If any of these package IDs have changed, run 'winget search <name>' and adjust." -ForegroundColor DarkGray
winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
winget install --id Microsoft.DotNet.AspNetCoreRuntime.9 -e --accept-source-agreements --accept-package-agreements
winget install --id PostgreSQL.PostgreSQL.16 -e --accept-source-agreements --accept-package-agreements

Pause-ForUser "The PostgreSQL installer may have opened its own window asking for a superuser ('postgres') password. Finish that wizard, remember the password, then come back here."

# Refresh PATH for this session (winget-installed tools register PATH but this process started before that)
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')

# ---------------------------------------------------------------------------
Step "Downloading Caddy (standalone binary, not on PATH — kept in $ToolsPath\caddy)"
$caddyDir = Join-Path $ToolsPath 'caddy'
New-Item -ItemType Directory -Force -Path $caddyDir | Out-Null
$caddyZip = Join-Path $env:TEMP 'caddy.zip'
Invoke-WebRequest -Uri 'https://caddyserver.com/api/download?os=windows&arch=amd64' -OutFile $caddyZip
Expand-Archive -Path $caddyZip -DestinationPath $caddyDir -Force
Remove-Item $caddyZip
if (-not (Test-Path (Join-Path $caddyDir 'caddy.exe'))) {
    throw "caddy.exe not found after download — check https://caddyserver.com/download manually and place it at $caddyDir\caddy.exe"
}

# ---------------------------------------------------------------------------
Step "Installing PM2 and registering it as a Windows Service"
npm install -g pm2
npm install -g pm2-windows-service
Write-Host "pm2-service-install will prompt for a service account — a dedicated local account is safer than using your own login, but a local admin account works too." -ForegroundColor DarkGray
pm2-service-install -n PM2

# ---------------------------------------------------------------------------
Step "Cloning deploy repo"
if (Test-Path $DeployRepoPath) {
    Write-Host "$DeployRepoPath already exists, skipping clone (re-run deploy\update.ps1 instead if this is a re-run)." -ForegroundColor Yellow
} else {
    git clone $DeployRepoUrl $DeployRepoPath
}

# ---------------------------------------------------------------------------
Step "Creating backend/.env from template (secrets generated locally, never committed)"
$backendEnvPath = Join-Path $DeployRepoPath 'backend\.env'
if (Test-Path $backendEnvPath) {
    Write-Host "backend\.env already exists, leaving it alone." -ForegroundColor Yellow
} else {
    $templatePath = Join-Path $DeployRepoPath 'deploy\backend.env.production.example'
    $content = Get-Content $templatePath -Raw

    function New-Secret {
        $bytes = New-Object byte[] 48
        [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
        [Convert]::ToBase64String($bytes)
    }

    Pause-ForUser "Enter the Postgres password you set during install when prompted next."
    $dbPassword = Read-Host "Postgres 'postgres' user password" -AsSecureString
    $dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

    $content = $content -replace 'DB_USERNAME=attendance_app', 'DB_USERNAME=postgres'
    $content = $content -replace 'DB_PASSWORD=REPLACE_ME_generate_a_real_password', "DB_PASSWORD=$dbPasswordPlain"
    $content = $content -replace 'JWT_SECRET=REPLACE_ME_openssl_rand_-base64_48', "JWT_SECRET=$(New-Secret)"
    $content = $content -replace 'ENCRYPTION_KEY=REPLACE_ME_openssl_rand_-base64_32', "ENCRYPTION_KEY=$(New-Secret)"
    Set-Content -Path $backendEnvPath -Value $content -Encoding utf8

    Write-Host "backend\.env written. Using the 'postgres' superuser for simplicity — create a dedicated least-privilege role instead if you want to harden this later." -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
Step "Creating the database"
$env:PGPASSWORD = $dbPasswordPlain
& "$env:ProgramFiles\PostgreSQL\16\bin\createdb.exe" -U postgres -h localhost attendance_system 2>$null
Write-Host "(If createdb.exe wasn't at that path, create the 'attendance_system' database manually with pgAdmin or psql.)" -ForegroundColor DarkGray

# ---------------------------------------------------------------------------
Step "Installing backend production dependencies"
corepack enable 2>$null
Push-Location (Join-Path $DeployRepoPath 'backend')
try {
    yarn install --production --frozen-lockfile
} finally {
    Pop-Location
}

# ---------------------------------------------------------------------------
Step "Applying database migrations + seeding default data"
Push-Location (Join-Path $DeployRepoPath 'backend')
try {
    yarn migration:run:prod
    Write-Host "Schema created. Seeding default shifts + admin users..." -ForegroundColor DarkGray
    node dist/database/seeders/initial-data.seeder.js
} finally {
    Pop-Location
}
Write-Host "Default logins: superadmin / SuperAdmin@123 and admin / Admin@123 — CHANGE THESE after first login." -ForegroundColor Red

# ---------------------------------------------------------------------------
Step "Opening Windows Firewall for port 80 only (backend/web/matcher stay localhost-only)"
New-NetFirewallRule -DisplayName 'Attendance System (HTTP)' -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -Profile Private,Domain | Out-Null

# ---------------------------------------------------------------------------
Step "Starting the stack under PM2"
pm2 start (Join-Path $DeployRepoPath 'ecosystem.config.js')
pm2 save

# ---------------------------------------------------------------------------
Step "Setting a friendly LAN hostname"
$hostname = Read-Host "Computer name to use for http://<name>.local (e.g. attendance-srv), or leave blank to skip"
if ($hostname) {
    Rename-Computer -NewName $hostname
    Write-Host "Renamed to '$hostname'. A REBOOT is required for this and the mDNS/.local advertisement to take effect." -ForegroundColor Yellow
}

Write-Host "`nSetup complete. After rebooting (if you renamed the computer), verify:" -ForegroundColor Green
Write-Host "  ping $hostname.local"
Write-Host "  http://$hostname.local  (or http://localhost while still on this machine)"
Write-Host "  pm2 status"
