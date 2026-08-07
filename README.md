# attendance-system-deploy

Deployment config for the [Attendance System](https://github.com/ericcrick/attendance-system-api)
— **not source code, and no compiled binaries either**. Just the small
text config the target desktop needs: a Docker Swarm stack file, a
reverse-proxy config, an env template, and PM2's process config.

This repo is public on purpose: it's plain text, nothing sensitive,
nothing compiled — so the target machine can pull it without any GitHub
authentication. Everything compiled (the backend/web Docker images, the
fingerprint-matcher exe) travels a different way entirely: built on a
dev machine and carried over on a USB drive, never pushed anywhere
public. See the source repo's `deploy/README.md` for why.

## What's here

- `docker-stack.yml` — Swarm stack for backend + web (local-only image
  tags — `docker load`ed from a USB drive, never pulled from a registry)
- `Caddyfile` — reverse proxy config (Caddy runs natively, not in Docker)
- `ecosystem.config.js` — PM2 config for the two native processes (Caddy,
  fingerprint-matcher)
- `backend.env.example` — template, fill in real values as `backend.env`
  (gitignored on the target, never committed)

The fingerprint-matcher executable is **not** in this repo — it comes in
on the same USB drive as the backend/web image tarballs. See
`deploy/target-setup.md` / `deploy/update.md` in the source repo.

## Setup on the target machine

Full walkthrough: [deploy/target-setup.md](https://github.com/ericcrick/attendance-system-api/blob/main/deploy/target-setup.md)
in the source repo. Short version:

```bash
git clone https://github.com/ericcrick/attendance-system-deploy.git
cd attendance-system-deploy
cp backend.env.example backend.env   # fill in real values

# copy attendance-backend.tar, attendance-web.tar, and the
# fingerprint-matcher/ folder in from a USB drive, then:
docker load -i attendance-backend.tar
docker load -i attendance-web.tar
docker swarm init
docker stack deploy --resolve-image=never -c docker-stack.yml attendance
pm2 start ecosystem.config.js
pm2 save
```

## Updating

See [deploy/update.md](https://github.com/ericcrick/attendance-system-api/blob/main/deploy/update.md)
in the source repo.
