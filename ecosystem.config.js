// PM2 process definitions, run FROM THE DEPLOY REPO ROOT on the target machine:
//   pm2 start ecosystem.config.js
//   pm2 save
//
// backend/web run in PM2 "cluster" exec_mode with a single instance. Cluster
// mode (not fork mode) is what makes `pm2 reload` zero-downtime: PM2 starts
// a replacement worker, waits for it to report "listening", then stops the
// old one — the port is handed off, nothing gets dropped. instances stays at
// 1 (not 2+) deliberately: the backend holds a stateful, single-connection
// link to the ZKTeco terminal (see backend/src/modules/fingerprint/zkteco.service.ts)
// that must not run in more than one process at a time. Bump `instances` on
// web later if you ever need more throughput — it has no such constraint.
//
// fingerprint-matcher and caddy run in "fork" mode, single instance, plain
// restart on update (a few seconds' gap) — see deploy/README.md for why
// that's an accepted tradeoff.

module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: __dirname + '/backend',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      wait_ready: false,
      listen_timeout: 10000,
      kill_timeout: 5000,
      max_memory_restart: '500M',
      out_file: __dirname + '/logs/backend-out.log',
      error_file: __dirname + '/logs/backend-error.log',
      time: true,
    },
    {
      name: 'web',
      cwd: __dirname + '/web/standalone',
      script: 'server.js',
      exec_mode: 'cluster',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
      },
      listen_timeout: 10000,
      kill_timeout: 5000,
      max_memory_restart: '500M',
      out_file: __dirname + '/logs/web-out.log',
      error_file: __dirname + '/logs/web-error.log',
      time: true,
    },
    {
      name: 'fingerprint-matcher',
      cwd: __dirname + '/fingerprint-matcher',
      script: 'FingerprinterMatcher.exe',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      out_file: __dirname + '/logs/matcher-out.log',
      error_file: __dirname + '/logs/matcher-error.log',
      time: true,
    },
    {
      // caddy.exe lives outside the deploy repo (in ../tools/caddy, a sibling
      // of this repo's clone — see target-setup.ps1) so it's never touched by
      // `git pull` and doesn't need to be re-downloaded on every update.
      name: 'caddy',
      cwd: __dirname,
      script: __dirname + '/../tools/caddy/caddy.exe',
      args: 'run --config Caddyfile --adapter caddyfile',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      out_file: __dirname + '/logs/caddy-out.log',
      error_file: __dirname + '/logs/caddy-error.log',
      time: true,
    },
  ],
};
