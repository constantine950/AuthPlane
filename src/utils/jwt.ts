import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "../config/env";

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

const secret = new TextEncoder().encode(env.jwt.secret);

export const generateAccessToken = async (
  payload: TokenPayload,
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.jwt.expiresIn)
    .setIssuedAt()
    .sign(secret);
};

export const verifyAccessToken = async (
  token: string,
): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, secret);
  return payload as TokenPayload;
};
