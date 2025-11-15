import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../database/models/session.model";
import { UserDocument } from "../database/models/user.model";
import { config } from "../config/app.config";

export type AccessTPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type RefreshTPayload = {
  sessionId: SessionDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: +config.JWT.JWT_EXPIRES_IN,
  secret: config.JWT.JWT_SECRET,
  audience: ["user"],
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: +config.JWT.JWT_REFRESH_EXPIRES_IN,
  secret: config.JWT.JWT_SECRET,
  audience: ["user"],
};

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = config.JWT.JWT_SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      audience: ["user"],
    }) as TPayload;
    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
