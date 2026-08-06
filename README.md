# Deploying to a standalone Windows 11 desktop (no Docker)

Two repos are involved:

- **This repo** (source) — where you write code and run `deploy\publish.ps1`
  on your **dev machine**.
- **A separate private "deploy" repo** (compiled output only — no `.ts`/`.cs`
  source, no tests, no git history of the real codebase) — what the **target
  desktop** actually clones and runs. Create it once, empty, on GitHub (or
  wherever), private, and give the target machine read-only access to it
  (e.g. a fine-scoped PAT or deploy key) — deliberately *not* the same
  credentials that can see this source repo.

Why two repos: you asked for `git pull`-based updates without the machine
having access to your real source. This is how those two requirements are
reconciled — the compiled `dist/`, Next's `standalone` build, and the .NET
publish output are the only things that ever leave your dev machine.

## One-time: create the deploy repo

```
gh repo create yourorg/attendance-system-deploy --private
git clone https://github.com/yourorg/attendance-system-deploy.git D:\attendance-system-deploy
```
(Or create it in GitHub's UI / your git host of choice — any empty private
repo works. `publish.ps1` just needs a local git clone of it to write into.)

## One-time: cut the first release

On your **dev machine**, from this repo's root:

```powershell
.\deploy\publish.ps1 -DeployRepoPath D:\attendance-system-deploy
```

This builds all three services and stages the compiled output into the
deploy repo clone, then commits (but does not push — review it first):

```powershell
cd D:\attendance-system-deploy
git log -1 --stat
git push
```

## One-time: set up the target desktop

On the **target machine**, as Administrator, with Git already available to
pull the deploy repo (or install Git first — `target-setup.ps1` does this):

```powershell
irm https://raw.githubusercontent.com/yourorg/attendance-system-deploy/main/deploy/target-setup.ps1 -OutFile target-setup.ps1
# or just copy the script over some other way if the repo isn't reachable yet
.\target-setup.ps1 -DeployRepoUrl https://github.com/yourorg/attendance-system-deploy.git
```

This installs Node.js, .NET 9 runtime, PostgreSQL, Caddy, and PM2 (registered
as a Windows Service so the whole stack survives reboots with nobody logged
in), clones the deploy repo, creates `backend\.env` from the template with
freshly generated secrets, creates the database, bootstraps the schema and
default admin users, opens the firewall for port 80 only, and starts
everything under PM2.

**A few steps in that script are genuinely interactive and can't be fully
scripted** — the PostgreSQL installer's own setup wizard, and the
`pm2-service-install` prompt for a service account. The script pauses and
tells you when it's waiting on you.

**Change the default admin passwords immediately** — the seeder creates
`superadmin` / `SuperAdmin@123` and `admin` / `Admin@123`.

If you set a hostname during setup, reboot, then confirm from another device
on the LAN:
```
ping attendance-srv.local
```
Open `http://attendance-srv.local` in a browser from any machine on the
network — that's the one URL everyone uses.

**If `.local` doesn't resolve on some client** (older Windows without mDNS,
locked-down corporate devices, some IoT-ish hardware): reserve a static IP
for the desktop in your router's DHCP settings and use `http://<that-ip>`
instead — works everywhere, no dependency on mDNS. You can offer both; Caddy
doesn't care what hostname/IP was used to reach it.

## Every future update

On your dev machine: `.\deploy\publish.ps1 -DeployRepoPath D:\attendance-system-deploy`
then review and `git push` as above.

On the target machine, from inside the deploy repo clone:
```powershell
cd C:\attendance-app\deploy-repo
.\deploy\update.ps1
```
This pulls, reinstalls backend dependencies only if `package.json`/`yarn.lock`
changed, then does `pm2 startOrReload` — a rolling restart for backend and
web with **no dropped connections or downtime** (PM2 starts the replacement
process, waits for it to report ready, then retires the old one). The
fingerprint-matcher service and Caddy only restart if their own files
changed, and that restart takes a few seconds — acceptable since nothing in
the browser talks to the matcher directly.

**Rollback**: `git log` in the deploy repo to find the previous commit, then
`git checkout <commit> -- .` followed by `pm2 startOrReload ecosystem.config.js`.

## Schema changes

The database schema is managed entirely through TypeORM migrations
(`backend/src/database/migrations/`) — `synchronize` is off everywhere,
including local dev, so what's checked in is always the real source of
truth. Whenever you add/change an entity:

```powershell
cd backend
yarn migration:generate src/database/migrations/DescriptiveName
yarn migration:run   # applies it to your local dev DB
```

Commit the generated migration file. `publish.ps1` builds it into `dist/`
like any other code change, and `deploy\update.ps1` runs
`yarn migration:run:prod` on the target machine automatically, before
reloading the services — so schema changes ship exactly the same way code
changes do, no manual DB surgery required.

## Day-to-day operations

```powershell
pm2 status              # what's running
pm2 logs                # tail all logs
pm2 logs backend         # just one service
pm2 monit                # live resource view
```

Logs also land in `<deploy-repo>\logs\*.log` (rotate/clean these periodically
— nothing here does that automatically).

## Known limitations, worth fixing as a fast-follow

- **Single machine, no HA.** If this desktop is off, the app is down for
  everyone — there's no failover. That's consistent with "one office desktop
  serves the LAN," just flagging it's not redundant.
- **Postgres backups.** Nothing here sets up scheduled backups. At minimum,
  a nightly `pg_dump` to another drive (or another machine) is worth adding.
- **fingerprint-matcher isn't zero-downtime.** Deliberate tradeoff per your
  call — it's internal-only, called server-side by the backend, so a few
  seconds' restart gap during an update just delays in-flight fingerprint
  matches rather than being visible to anyone in a browser.
