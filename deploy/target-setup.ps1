<#
.SYNOPSIS
  ONE-TIME setup for the target Windows 11 desktop. Run as Administrator.
  Installs prerequisites, clones the deploy repo, and gets the stack ready
  to start. Read deploy/README.md alongside this - several steps below are
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

# PowerShell's $ErrorActionPreference only catches PowerShell-level errors -
# a native command (winget, git, pm2, ...) returning a non-zero exit code
# does NOT stop the script on its own. Every external command that matters
# goes through this so a real failure actually halts setup instead of quietly
# continuing into a broken next step.
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
Invoke-Checked { winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements } "Node.js install failed"
Invoke-Checked { winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements } "Git install failed"
Invoke-Checked { winget install --id Microsoft.DotNet.AspNetCoreRuntime.9 -e --accept-source-agreements --accept-package-agreements } ".NET runtime install failed"
Invoke-Checked { winget install --id PostgreSQL.PostgreSQL.16 -e --accept-source-agreements --accept-package-agreements } "PostgreSQL install failed"

Pause-ForUser "The PostgreSQL installer may have opened its own window asking for a superuser ('postgres') password. Finish that wizard, remember the password, then come back here."

# Refresh PATH for this session (winget-installed tools register PATH but this process started before that)
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')

# ---------------------------------------------------------------------------
Step "Downloading Caddy (standalone binary, not on PATH - kept in $ToolsPath\caddy)"
$caddyDir = Join-Path $ToolsPath 'caddy'
New-Item -ItemType Directory -Force -Path $caddyDir | Out-Null

# NOT caddyserver.com/api/download - that endpoint dynamically COMPILES a
# custom binary server-side on every request (slow, and returns a bare .exe,
# not a zip, so Expand-Archive would fail on it). GitHub release assets are
# static pre-built zips and much more reliable for a setup script.
Write-Host "Looking up the latest Caddy release..." -ForegroundColor DarkGray
$release = Invoke-RestMethod -Uri 'https://api.github.com/repos/caddyserver/caddy/releases/latest'
$asset = $release.assets | Where-Object { $_.name -like '*windows_amd64.zip' } | Select-Object -First 1
if (-not $asset) {
    throw "Couldn't find a windows_amd64.zip asset in the latest Caddy release - check https://github.com/caddyserver/caddy/releases manually."
}
$caddyZip = Join-Path $env:TEMP 'caddy.zip'
Write-Host "Downloading $($asset.name)..." -ForegroundColor DarkGray
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $caddyZip
Expand-Archive -Path $caddyZip -DestinationPath $caddyDir -Force
Remove-Item $caddyZip
if (-not (Test-Path (Join-Path $caddyDir 'caddy.exe'))) {
    throw "caddy.exe not found after extracting - check https://github.com/caddyserver/caddy/releases manually and place it at $caddyDir\caddy.exe"
}
& (Join-Path $caddyDir 'caddy.exe') version
if ($LASTEXITCODE -ne 0) {
    throw "caddy.exe downloaded but won't run - re-download may be needed."
}

# ---------------------------------------------------------------------------
Step "Installing PM2 and registering it as a Windows Service"
Invoke-Checked { npm install -g pm2 } "npm install -g pm2 failed"
Invoke-Checked { npm install -g pm2-windows-service } "npm install -g pm2-windows-service failed"
Write-Host "pm2-service-install will prompt for a service account - a dedicated local account is safer than using your own login, but a local admin account works too." -ForegroundColor DarkGray
Invoke-Checked { pm2-service-install -n PM2 } "pm2-service-install failed"

# ---------------------------------------------------------------------------
Step "Cloning deploy repo"
if (Test-Path $DeployRepoPath) {
    Write-Host "$DeployRepoPath already exists, skipping clone (re-run deploy\update.ps1 instead if this is a re-run)." -ForegroundColor Yellow
} else {
    Invoke-Checked { git clone $DeployRepoUrl $DeployRepoPath } "git clone of deploy repo failed"
}

# ---------------------------------------------------------------------------
Step "Creating backend/.env from template (secrets generated locally, never committed)"
$backendEnvPath = Join-Path $DeployRepoPath 'backend\.env'
$requiredPlaceholders = @(
    'DB_USERNAME=attendance_app',
    'DB_PASSWORD=REPLACE_ME_generate_a_real_password',
    'JWT_SECRET=REPLACE_ME_openssl_rand_-base64_48',
    'ENCRYPTION_KEY=REPLACE_ME_openssl_rand_-base64_32'
)

function New-Secret {
    $bytes = New-Object byte[] 48
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    [Convert]::ToBase64String($bytes)
}

if (Test-Path $backendEnvPath) {
    Write-Host "backend\.env already exists, leaving it alone." -ForegroundColor Yellow
    # Re-run scenario: read the DB password back out of the existing file so
    # the "creating the database" step below still has something to connect
    # with, instead of silently using an empty password.
    $existingDbLine = Get-Content $backendEnvPath | Where-Object { $_ -match '^DB_PASSWORD=' }
    $dbPasswordPlain = ($existingDbLine -split '=', 2)[1]
} else {
    $templatePath = Join-Path $DeployRepoPath 'deploy\backend.env.production.example'
    $content = Get-Content $templatePath -Raw

    Pause-ForUser "Enter the Postgres password you set during install when prompted next."
    $dbPassword = Read-Host "Postgres 'postgres' user password" -AsSecureString
    $dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

    $content = $content -replace [regex]::Escape($requiredPlaceholders[0]), 'DB_USERNAME=postgres'
    $content = $content -replace [regex]::Escape($requiredPlaceholders[1]), "DB_PASSWORD=$dbPasswordPlain"
    $content = $content -replace [regex]::Escape($requiredPlaceholders[2]), "JWT_SECRET=$(New-Secret)"
    $content = $content -replace [regex]::Escape($requiredPlaceholders[3]), "ENCRYPTION_KEY=$(New-Secret)"

    # If the template's placeholder text ever changes without updating the
    # -replace patterns above, -replace silently no-ops instead of erroring -
    # so check the placeholders are actually gone rather than trust it worked.
    foreach ($placeholder in $requiredPlaceholders) {
        if ($content -like "*$placeholder*") {
            throw "backend.env.production.example's placeholder '$placeholder' wasn't replaced - the template text and this script's -replace patterns have drifted apart. Fix target-setup.ps1."
        }
    }

    Set-Content -Path $backendEnvPath -Value $content -Encoding utf8
    Write-Host "backend\.env written. Using the 'postgres' superuser for simplicity - create a dedicated least-privilege role instead if you want to harden this later." -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
Step "Creating the database"
$dbNameLine = Get-Content $backendEnvPath | Where-Object { $_ -match '^DB_NAME=' }
$dbName = ($dbNameLine -split '=', 2)[1]
$env:PGPASSWORD = $dbPasswordPlain
$createdbExe = "$env:ProgramFiles\PostgreSQL\16\bin\createdb.exe"
if (-not (Test-Path $createdbExe)) {
    throw "createdb.exe not found at $createdbExe - PostgreSQL may have installed to a different location. Create the '$dbName' database manually, then re-run this script (it will skip past this step since backend\.env already exists)."
}
& $createdbExe -U postgres -h localhost $dbName 2>$null
if ($LASTEXITCODE -ne 0) {
    # createdb exits non-zero if the database already exists too - that's
    # fine on a re-run, but distinguish it from a real failure (bad password,
    # Postgres not running) by actually checking whether the DB is there now.
    & "$env:ProgramFiles\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -lqt 2>$null | Select-String -Pattern "^\s*$dbName\s" | Out-Null
    if (-not $?) {
        throw "Could not create database '$dbName' and it doesn't already exist - check the Postgres password and that the PostgreSQL service is running."
    }
    Write-Host "Database '$dbName' already exists, continuing." -ForegroundColor Yellow
}

# ---------------------------------------------------------------------------
Step "Installing backend production dependencies"
try {
    corepack enable
} catch {
    Write-Host "corepack enable failed ($_) - continuing, since yarn may already be available another way." -ForegroundColor Yellow
}
Push-Location (Join-Path $DeployRepoPath 'backend')
try {
    Invoke-Checked { yarn install --production --frozen-lockfile } "yarn install failed"
} finally {
    Pop-Location
}

# ---------------------------------------------------------------------------
Step "Applying database migrations + seeding default data"
Push-Location (Join-Path $DeployRepoPath 'backend')
try {
    Invoke-Checked { yarn migration:run:prod } "Database migration failed"
    Write-Host "Schema created. Seeding default shifts + admin users..." -ForegroundColor DarkGray
    Invoke-Checked { node dist/database/seeders/initial-data.seeder.js } "Seeding default data failed"
} finally {
    Pop-Location
}
Write-Host "Default logins: superadmin / SuperAdmin@123 and admin / Admin@123 - CHANGE THESE after first login." -ForegroundColor Red

# ---------------------------------------------------------------------------
Step "Opening Windows Firewall for port 80 only (backend/web/matcher stay localhost-only)"
New-NetFirewallRule -DisplayName 'Attendance System (HTTP)' -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -Profile Private,Domain | Out-Null

$publicProfiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Public' }
if ($publicProfiles) {
    Write-Host "WARNING: this machine's network connection is currently classified 'Public' Windows Firewall profile:" -ForegroundColor Red
    $publicProfiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Red }
    Write-Host "The firewall rule just created only allows Private/Domain profiles, so nobody on the LAN will actually" -ForegroundColor Red
    Write-Host "be able to reach port 80 until this is fixed. If this is really your trusted office network, run:" -ForegroundColor Red
    Write-Host "  Set-NetConnectionProfile -InterfaceAlias '<name from above>' -NetworkCategory Private" -ForegroundColor Red
}

# ---------------------------------------------------------------------------
Step "Starting the stack under PM2"
Invoke-Checked { pm2 startOrReload (Join-Path $DeployRepoPath 'ecosystem.config.js') } "pm2 start failed"
pm2 save

# ---------------------------------------------------------------------------
Step "Setting a friendly LAN hostname"
$hostname = Read-Host "Computer name to use for http://<name>.local (e.g. attendance-srv), or leave blank to skip"
if ($hostname) {
    Rename-Computer -NewName $hostname
    Write-Host "Renamed to '$hostname'. A REBOOT is required for this and the mDNS/.local advertisement to take effect." -ForegroundColor Yellow
    Write-Host "`nSetup complete. After rebooting, verify:" -ForegroundColor Green
    Write-Host "  ping $hostname.local"
    Write-Host "  http://$hostname.local"
} else {
    Write-Host "`nSetup complete. Verify:" -ForegroundColor Green
    Write-Host "  http://localhost  (from this machine)"
    Write-Host "  Reserve a static IP for this desktop in your router, then http://<that-ip> from any other machine on the LAN."
}
Write-Host "  pm2 status"
