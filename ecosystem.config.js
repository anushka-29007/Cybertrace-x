module.exports = {
  apps: [
    {
      name: 'cybertrace-x',
      script: 'server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
