import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "../config/env";

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

const secret = new TextEncoder().encode(env.jwt.secret);

const ISSUER = env.jwt.issuer;
const AUDIENCE = env.jwt.audience;

export const generateAccessToken = async (
  payload: TokenPayload,
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(payload.userId)
    .setExpirationTime(env.jwt.expiresIn)
    .sign(secret);
};

export const verifyAccessToken = async (
  token: string,
): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, secret, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  return payload as TokenPayload;
};
