# attendance-system-deploy

Deployment config for the [Attendance System](https://github.com/ericcrick/attendance-system-api)
— **not source code**. Just the handful of small files the target desktop
needs to run the app: a Docker Swarm stack file, a reverse-proxy config,
and two env templates (no secrets in either — real values get filled in
locally on the target machine and never committed here).

This repo is public on purpose: it lets the target machine pull these
files without any GitHub authentication. The actual application — the
compiled backend/web/fingerprint-matcher images — lives in private GitHub
Container Registry packages, pulled directly by `docker-stack.yml` below;
this repo never contains any of that.

## Setup on the target machine

```bash
git clone https://github.com/ericcrick/attendance-system-deploy.git
cd attendance-system-deploy
cp backend.env.example backend.env    # fill in real values
cp postgres.env.example postgres.env  # fill in real values (same password as backend.env)
docker swarm init
docker stack deploy -c docker-stack.yml attendance
```

Full walkthrough (WSL2, mirrored networking, etc.):
[deploy/target-setup.md](https://github.com/ericcrick/attendance-system-api/blob/main/deploy/target-setup.md)
in the source repo.

## Updating

Almost never need to touch this repo again after first setup — routine
app updates are just `docker stack deploy -c docker-stack.yml attendance`
on the target, which pulls whatever's newly pushed to the registry. Only
`git pull` here if `docker-stack.yml` or `Caddyfile` themselves change,
which should be rare.
