module.exports = {
  apps: [
    {
      name: 'ai-solutions-backend',
      script: './src/server.js',
      instances: 'max', // Scales to use all available CPU cores
      exec_mode: 'cluster', // Enables clustering
      watch: false, // Set to true in development if desired
      max_memory_restart: '1G', // Restarts process if memory exceeds 1GB
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true, // Merges logs from all cluster instances into one file
      autorestart: true, // Restarts on crash
      exp_backoff_restart_delay: 100, // Gradual restart delay on loops
    },
  ],
};
