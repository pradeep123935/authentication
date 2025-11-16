import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/catch-errors";
import UserModel from "../../database/models/user.model";
import SessionModel from "../../database/models/session.model";
import { refreshTokenSignOptions, signJwtToken } from "../../utils/jwt";

export class MfaService {
  public async generateMfaSetup(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA is already enabled for this user",
      };
    }

    let secretKey = user.userPreferences.twoFactorSecret;

    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "Squeezy" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "squeezy.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
      message: "Scan the QR code or use the setup key.",
      secret: secretKey,
      qrImageUrl,
    };
  }

  public async verifyMfaSetup(req: Request, code: string, secretKey: string) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA is already enabled for this user",
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA,
        },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    user.userPreferences.enable2FA = true;
    await user.save();

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async revokeMfa(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    if (!user.userPreferences.enable2FA) {
      return {
        message: "MFA is not enabled",
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA,
        },
      };
    }

    user.userPreferences.enable2FA = false;
    user.userPreferences.twoFactorSecret = undefined;
    await user.save();

    return {
      message: "MFA has been revoked successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async verifyMfaForLogin(
    code: string,
    email: string,
    userAgent?: string
  ) {
    const user = await UserModel.findOne({ email });

    if (
      !user?.userPreferences.enable2FA &&
      !user?.userPreferences.twoFactorSecret
    ) {
      throw new UnauthorizedException("MFA is not enabled for this user");
    }

    const isValid = speakeasy.totp.verify({
      secret: user.userPreferences.twoFactorSecret!,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions
    );

    return { user, accessToken, refreshToken };
  }
}
