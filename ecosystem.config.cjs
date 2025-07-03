module.exports = {
  apps: [
    {
      name: "strapi-v4",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      instances: 1,
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      user: "root",
      host: ["34.142.59.229"],
      ref: "origin/master",
      repo: "git@github.com:plutio/strapi.git",
      path: "/var/www/strapi-v4",
      "pre-deploy-local":
        "scp -r config/env/production root@34.142.59.229:/strapi-config; scp -r ca-certificate.cer root@34.142.59.229:/strapi-config/ca-certificate.cer; scp -r .env root@34.142.59.229:/strapi-config/.env;",
      "post-deploy":
        "cp /strapi-config/ca-certificate.cer ./; cp -a /strapi-config/production ./config/env; cp /strapi-config/.env ./; npm install --production; NODE_ENV=production npm run build; pm2 startOrRestart ecosystem.config.cjs --update-env --env production",
    },
  },
};
