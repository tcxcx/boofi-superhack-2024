module.exports = {
  apps: [
    {
      name: "boofi-backend",
      script: "./dist/app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
};
