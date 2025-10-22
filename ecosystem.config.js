module.exports = {
  apps: [
    {
      name: 'jumping-server',
      script: 'dist/main.js',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      out_file: './logs/jumping-out.log',
      error_file: './logs/jumping-error.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3508,
      },
    },
  ],
};
