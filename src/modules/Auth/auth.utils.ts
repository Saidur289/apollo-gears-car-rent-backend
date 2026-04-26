import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";

export const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const createAccessToken = (payload: Record<string, unknown>): string => {
  return createToken(
    payload,
    config.jwt.access_secret!,
    config.jwt.access_expires_in! as SignOptions["expiresIn"],
  );
};

export const createRefreshToken = (
  payload: Record<string, unknown>,
): string => {
  return createToken(
    payload,
    config.jwt.refresh_secret!,
    config.jwt.refresh_expires_in! as SignOptions["expiresIn"],
  );
};
