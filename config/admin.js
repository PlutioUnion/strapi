module.exports = ({ env }) => ({
  apiToken: { salt: env("API_TOKEN_SALT") },
  auth: {
    secret: env("ADMIN_JWT_SECRET", "46f6856177634b76bac0c72894e62ffd"),
  },
});
