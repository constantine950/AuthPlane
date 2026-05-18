import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    issuer: process.env.JWT_ISSUER || "authplane",
    audience: process.env.JWT_AUDIENCE || "authplane-client",
  },
};
