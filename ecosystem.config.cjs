module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        PORT: 3002,
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    }
  ]
};
