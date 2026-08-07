// PM2 manages the two native Windows processes that sit alongside the
// Docker-hosted backend/web: Caddy (the reverse proxy) and
// fingerprint-matcher (native win-x64 exe - see deploy/update.md for how
// it gets here). Both restart automatically if they crash and survive
// reboots once PM2 itself is registered as a Windows Service.
//
// Run FROM THE DEPLOY FOLDER on the target machine:
//   pm2 start ecosystem.config.js
//   pm2 save

module.exports = {
  apps: [
    {
      // caddy.exe lives outside this folder (in ../tools/caddy, a sibling
      // - see deploy/target-setup.md) so it's never touched by an update.
      name: 'caddy',
      cwd: __dirname,
      script: __dirname + '/../tools/caddy/caddy.exe',
      args: 'run --config Caddyfile --adapter caddyfile',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      out_file: __dirname + '/logs/caddy-out.log',
      error_file: __dirname + '/logs/caddy-error.log',
      time: true,
    },
    {
      // fingerprint-matcher.exe lives in ./fingerprint-matcher, published
      // for win-x64 and copied in from a USB drive (see
      // deploy/target-setup.md, deploy/update.md) - not zero-downtime on
      // purpose (internal-only, called server-to-server by the backend,
      // never a browser - a brief restart during an update is invisible
      // to anyone actually using the app).
      name: 'fingerprint-matcher',
      cwd: __dirname + '/fingerprint-matcher',
      script: 'FingerprinterMatcher.exe',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      out_file: __dirname + '/logs/matcher-out.log',
      error_file: __dirname + '/logs/matcher-error.log',
      time: true,
    },
  ],
};
