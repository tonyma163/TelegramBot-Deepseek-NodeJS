module.exports = {
  apps: [
    {
      name: 'telegram-bot',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 30000, // 30 seconds delay between restarts
      watch: false,
      max_memory_restart: '200M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
