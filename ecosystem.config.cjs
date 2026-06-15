// PM2 process configuration for the NRG Discord bot.
// Start: pm2 start ecosystem.config.cjs
// View logs: pm2 logs nrg-bot
// Restart: pm2 restart nrg-bot
// Persist across reboots: pm2 startup && pm2 save

module.exports = {
  apps: [
    {
      name: 'nrg-bot',
      script: 'bot.js',
      cwd: '/opt/nrg-bot',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/opt/nrg-bot/logs/error.log',
      out_file: '/opt/nrg-bot/logs/out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
