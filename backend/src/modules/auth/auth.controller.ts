import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middlewares/asyncController";
import { AuthService } from "./auth.service";
import { emailSchema, loginSchema, registerSchema, verificationEmailSchema } from "../../validators/auth.validator";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../../utils/cookie";
import { UnauthorizedException } from "../../utils/catch-errors";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(async (req, res, next): Promise<any> => {
    const body = registerSchema.parse({
      ...req.body,
    });
    const { user } = await this.authService.register(body);
    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      data: user,
    });
  });

  public login = asyncHandler(async (req, res, next): Promise<any> => {
    const userAgent = req.headers["user-agent"];
    const body = loginSchema.parse({
      ...req.body,
      userAgent,
    });

    const { user, accessToken, refreshToken, mfaRequired } =
      await this.authService.login(body);
    return setAuthenticationCookies({ res, accessToken, refreshToken })
      .status(StatusCodes.OK)
      .json({
        message: "User login successfully",
        user,
        mfaRequired,
      });
  });

  public refresh = asyncHandler(async (req, res, next): Promise<any> => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException("Missing refresh token!!");
    }

    const { accessToken, newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    if (newRefreshToken) {
      res.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions()
      );
    }

    return res
      .status(StatusCodes.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({
        message: "Token refreshed successfully",
        accessToken,
      });
  });

  public verifyEmail = asyncHandler(async (req, res, next): Promise<any> => {
    const { code } = verificationEmailSchema.parse(req.body);
    await this.authService.verifyEmail(code);
    return res.status(StatusCodes.OK).json({
      message: "Email verified successfully",
    });
  });

  public forgotPassword = asyncHandler(async (req, res, next): Promise<any> => {
    const email = emailSchema.parse(req.body.email);
    await this.authService.forgotPassword(email);
    return res.status(StatusCodes.OK).json({
      message: "Password reset email sent successfully",
    });
  });
}
