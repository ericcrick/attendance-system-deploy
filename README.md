# My notes on how I deploy this thing

This is me explaining to future-me how this whole setup works, in plain
words, so I don't have to re-learn it every time. I'm writing this like I'm
explaining it to a 5 year old, because 6 months from now that's basically
what I'll need.

## The big picture, in one paragraph

I have an app made of 3 little programs (backend, web, fingerprint-matcher)
plus a database. I want to put all of that on one Windows desktop that sits
in the office, and I want everyone on the office WiFi/network to be able to
open one link in their browser and just use it. I don't have Docker on that
desktop and I don't want to install it. So instead, I install each thing
"for real" on Windows (like installing any normal program) and I use a
couple of small tools to keep everything running and to make updates not
break anything while people are using it.

## Why two GitHub repos instead of one?

- **`attendance-system-api`** (this repo) — my actual code. TypeScript,
  React, C#. The stuff I write and think about.
- **`attendance-system-deploy`** — NOT code I write by hand. It only holds
  the *finished, compiled* version of my app — the stuff you get after you
  run "build". No `.ts` files, no `.cs` files, nothing a person would read
  as source code.

Why bother with two? Because the office desktop needs `git pull` to be able
to grab updates easily, but I don't want that shared office computer to have
my actual source code sitting on it (anyone with physical/network access to
that machine could poke around). So: I build on my own dev machine, and I
only ever push the *finished result* to the second repo. The desktop only
ever talks to the second repo. Think of it like — one repo is my recipe
book, the other repo is the actual cake, already baked, ready to eat. The
desktop only ever gets handed a cake, never the recipe.

## What each tool is actually doing (so it's not just magic)

- **PostgreSQL** — the database. Where all the attendance records, employee
  info, etc. actually live. Installed directly on the Windows desktop like
  any other app (no Docker).
- **PM2** — think of it as a babysitter for my 3 programs. It starts them,
  and if one of them crashes, PM2 notices and restarts it automatically. It
  also knows a trick called "reload", which is the key to updating the app
  without anyone noticing — more on that below.
- **Caddy** — the receptionist. Everyone on the network types one address
  into their browser (like `http://attendance-srv.local`). Caddy is the
  thing that actually answers, looks at what was asked for, and quietly
  forwards the request to the right program behind the scenes (the web app,
  or the backend API). Nobody outside ever needs to know there are 3
  separate programs — Caddy hides that.
- **The fingerprint-matcher** — a little C#/.NET helper that only the
  backend talks to (never a browser directly), so it's never exposed to the
  network. It just does fingerprint matching when the backend asks it to.

## How updating without downtime actually works

This was the part I most wanted, so here's how it's really happening: PM2
doesn't update a running program by just killing it and starting the new
one (that would cause a gap where the app is down). Instead, for the
backend and the web app, it starts the *new* version first, waits until
it's fully up and listening, and only *then* quietly retires the old one.
There's a handoff, not a gap. That's why nobody sees an error page during an
update.

The fingerprint-matcher and Caddy don't get this same treatment — they just
restart plainly, which takes a couple of seconds. That's fine because
nothing in a browser ever talks to the fingerprint-matcher directly (only
the backend does, quietly, behind the scenes), and Caddy's config almost
never changes anyway.

## Two kinds of `.env` file (this tripped me up, worth writing down)

There's `backend/.env` and there's `web/.env.production`, and they get used
in *completely different ways*. I kept mixing this up, so:

**`backend/.env`** — read fresh, every single time the backend program
starts, directly on the machine it's running on. This is normal: it's how
the backend knows the database password, the JWT secret, etc. Nothing about
it is baked in ahead of time.

- On the office desktop, `target-setup.ps1` creates this file **once**, the
  first time, by copying `deploy/backend.env.production.example` and
  filling in generated passwords/secrets.
- After that, it's never touched again automatically. `git pull` (which is
  what `update.ps1` runs) will never overwrite it, because it's listed in
  the deploy repo's `.gitignore` — it only ever exists as a real file
  sitting on that one machine, never in git, never in either repo's
  history. If I ever need to change something in it (say, rotate the JWT
  secret), I do that by hand, directly on the desktop, then restart with
  `pm2 restart backend`.

**`web/.env.production`** — completely different story. The web app is
Next.js, and anything in there starting with `NEXT_PUBLIC_` gets *baked
directly into the JavaScript* the moment I run the build (`next build`),
which happens on my dev machine when I run `publish.ps1` — NOT on the
office desktop. By the time the compiled web app reaches the desktop, this
value is already frozen inside the code, like a message baked into a cake
rather than a note taped to the box. There is nothing to configure on the
target machine for the web app — it's already decided by the time it gets
there.

So if I ever want to change `NEXT_PUBLIC_KIOSK_ID` or the API URL: editing
it on the desktop does **nothing**. I have to edit
`web/.env.production` here, on my dev machine, then run `publish.ps1` again
to rebuild and ship a new version.

(There's a `deploy/web.env.production.example` file too, but it's just
there so I remember what the values are supposed to be — it doesn't
actually get "installed" anywhere, unlike the backend one.)

## Setting this up on a brand new desktop (one-time only)

Step 1 — on my dev machine, build everything and hand it to the deploy repo:

```powershell
.\deploy\publish.ps1 -DeployRepoPath E:\Projects\attendance-system-deploy
cd E:\Projects\attendance-system-deploy
git log -1 --stat   # sanity check what's about to go up — no source files!
git push
```

Step 2 — on the actual office desktop, as Administrator:

```powershell
.\target-setup.ps1 -DeployRepoUrl https://github.com/ericcrick/attendance-system-deploy.git
```

What this one script does, and why:
- Installs Node.js, the .NET runtime, PostgreSQL, Caddy, and PM2 — the
  actual programs needed to run everything, no Docker involved.
- Registers PM2 as a proper Windows Service, so the whole app comes back up
  automatically after the desktop reboots or loses power, even with nobody
  logged in.
- Clones the deploy repo (the "cake", not the "recipe").
- Creates `backend\.env` from the template, with fresh random
  passwords/secrets it generates itself — I don't have to think of these.
- Creates the database and runs the migrations (see below) to build all the
  tables, then seeds a couple of default admin logins so I can actually log
  in the first time.
- Opens the firewall for port 80 only (that's the one door Caddy answers
  on) — the backend/web/matcher ports stay closed to the network, only
  reachable from the desktop itself.

A couple of steps in that script need me to actually be sitting there
(the PostgreSQL installer pops up its own window, and PM2 asks which
Windows account to run as) — the script pauses and tells me when it's
waiting on me.

**First thing to do after setup finishes: change the default passwords.**
The seeder creates `superadmin` / `SuperAdmin@123` and `admin` /
`Admin@123` — fine to log in with once, not fine to leave as-is.

Last step: give the desktop a friendly name so people don't have to
remember an IP address. The script offers to rename the computer (say,
to `attendance-srv`) — after a reboot, anyone on the office network can
just type `http://attendance-srv.local` into their browser and land on the
kiosk screen. If that doesn't resolve on some older device, reserving a
static IP for the desktop in the router and using `http://<that-ip>`
instead always works as a fallback.

## Shipping a normal update (the thing I'll do most often)

On my dev machine:

```powershell
.\deploy\publish.ps1 -DeployRepoPath E:\Projects\attendance-system-deploy
cd E:\Projects\attendance-system-deploy
git push
```

On the office desktop:

```powershell
cd C:\attendance-app\deploy-repo
.\deploy\update.ps1
```

That's genuinely it. It pulls the new version, applies any database changes
automatically, then does the zero-downtime PM2 reload described above.
Nobody using the kiosk or dashboard notices anything happened.

If something looks wrong afterward, rolling back is: find the previous
commit with `git log` in the deploy repo, `git checkout <that commit> -- .`,
then `pm2 startOrReload ecosystem.config.js` again.

## When I change something in the database (add a field, a new table, etc.)

I'm using something called "migrations" instead of letting the database
just auto-guess the schema — auto-guessing is convenient for messing around
locally but too risky for a real database with real data in it, since a
guess can be wrong. A migration is just a written-down, exact set of steps
("add this column", "create this table") that I can review before it
touches anything.

Whenever I change an entity (add a field, a new table, whatever):

```powershell
cd backend
yarn migration:generate src/database/migrations/DescriptiveName
yarn migration:run
```

Then I commit the new migration file like any other code change. From
there it's automatic — `publish.ps1` builds it in, and `update.ps1` on the
desktop applies any new migrations by itself, right before reloading the
app, every single time. I never have to manually touch the production
database.

## Commands I reach for day-to-day

```powershell
pm2 status          # is everything running?
pm2 logs            # what's everyone been up to (all 4 programs, tailed live)
pm2 logs backend     # just the backend's logs
pm2 monit            # live CPU/memory view
```

Log files also pile up in `<deploy-repo>\logs\*.log` — nothing cleans these
up automatically yet, worth doing eventually.

## Things I know are missing / should get to eventually

- **One desktop = one point of failure.** If that machine is off or breaks,
  the app is down for everyone, no backup server picks up the slack. Fine
  for a single-office setup, just being honest that it's not redundant.
- **No automatic database backups yet.** I should set up something simple
  like a nightly `pg_dump` to another drive so a hardware failure doesn't
  wipe out real attendance data.
- **Fingerprint-matcher restarts aren't zero-downtime**, on purpose — it's
  only ever talked to by the backend (never a browser), so a couple of
  seconds' restart during an update is invisible to anyone actually using
  the app.
