# attendance-system-deploy

Deployment config for the [Attendance System](https://github.com/ericcrick/attendance-system-api)
— **not source code**. Just what the target desktop needs to run
everything that isn't Docker: a Docker Swarm stack file (for the
backend/web containers), a reverse-proxy config, an env template, PM2's
process config, and the compiled fingerprint-matcher executable (~5MB,
win-x64, no source in it — just DLLs).

This repo is public on purpose: it lets the target machine pull all of
this without any GitHub authentication. The private source code lives
only in `attendance-system-api`; the backend/web Docker images live in
private-source-but-public-package GitHub Container Registry packages,
pulled directly by `docker-stack.yml`.

## What's here

- `docker-stack.yml` — Swarm stack for backend + web (pulled from ghcr.io)
- `Caddyfile` — reverse proxy config (Caddy runs natively, not in Docker)
- `ecosystem.config.js` — PM2 config for the two native processes (Caddy,
  fingerprint-matcher)
- `backend.env.example` — template, fill in real values as `backend.env`
  (gitignored on the target, never committed)
- `fingerprint-matcher/` — published win-x64 executable, run natively
  under PM2 (not containerized — see the source repo's `deploy/README.md`
  for why)

## Setup on the target machine

Full walkthrough: [deploy/target-setup.md](https://github.com/ericcrick/attendance-system-api/blob/main/deploy/target-setup.md)
in the source repo. Short version:

```bash
git clone https://github.com/ericcrick/attendance-system-deploy.git
cd attendance-system-deploy
cp backend.env.example backend.env   # fill in real values
docker swarm init
docker stack deploy -c docker-stack.yml attendance
pm2 start ecosystem.config.js
pm2 save
```

## Updating

See [deploy/update.md](https://github.com/ericcrick/attendance-system-api/blob/main/deploy/update.md)
in the source repo.
