const fs = require("fs");

module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env(
        "DATABASE_HOST",
        "strapi-do-user-1803167-0.b.db.ondigitalocean.com"
      ),
      port: env.int("DATABASE_PORT", 25060),
      database: env("DATABASE_NAME", "strapi-dev"),
      user: env("DATABASE_USERNAME", "dev"),
      password: env("DATABASE_PASSWORD", "AVNS_C4zH0SXgu-i3T1sXik_"),
      ssl: {
        ca: fs.readFileSync(`${__dirname}/../ca-certificate.cer`).toString(),
      },
    },
    debug: false,
  },
});
