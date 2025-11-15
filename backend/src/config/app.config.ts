import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT: {
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "900"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "2592000"),
  },
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  MAILER_SENDER: getEnv("MAILER_SENDER"),
});

export const config = appConfig();
