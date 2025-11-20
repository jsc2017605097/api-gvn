module.exports = {
  apps: [
    {
      name: 'my-project',
      script: './dist/main.js',
      instances: 1, // Số instance chạy (1 hoặc 'max' để chạy trên tất cả CPU cores)
      exec_mode: 'fork', // 'fork' hoặc 'cluster'
      watch: false, // Không watch file khi production
      max_memory_restart: '1G', // Tự động restart nếu vượt quá 1GB RAM
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true, // Tự động restart khi crash
      max_restarts: 10, // Số lần restart tối đa
      min_uptime: '10s', // Thời gian tối thiểu để coi là chạy thành công
      listen_timeout: 10000, // Thời gian chờ app khởi động (ms)
      kill_timeout: 5000, // Thời gian chờ trước khi force kill (ms)
    },
  ],
};

