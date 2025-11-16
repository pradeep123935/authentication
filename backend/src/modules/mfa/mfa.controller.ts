import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middlewares/asyncController";
import { MfaService } from "./mfa.service";
import {
  verifyMfaForLoginSchema,
  verifyMfaSchema,
} from "../../validators/mfa.validator";
import { setAuthenticationCookies } from "../../utils/cookie";

export class MfaController {
  private mfaService: MfaService;

  constructor(mfaService: MfaService) {
    this.mfaService = mfaService;
  }

  public generateMfaSetup = asyncHandler(
    async (req, res, next): Promise<any> => {
      const { secret, qrImageUrl, message } =
        await this.mfaService.generateMfaSetup(req);
      return res.status(StatusCodes.OK).json({
        message,
        secret,
        qrImageUrl,
      });
    }
  );

  public verifyMfaSetup = asyncHandler(async (req, res, next): Promise<any> => {
    const { code, secretKey } = verifyMfaSchema.parse(req.body);
    const { message, userPreferences } = await this.mfaService.verifyMfaSetup(
      req,
      code,
      secretKey
    );
    return res.status(StatusCodes.OK).json({
      message,
      userPreferences,
    });
  });

  public revokeMfa = asyncHandler(async (req, res, next): Promise<any> => {
    const { message, userPreferences } = await this.mfaService.revokeMfa(req);
    return res.status(StatusCodes.OK).json({
      message,
      userPreferences,
    });
  });

  public verifyMfaForLogin = asyncHandler(
    async (req, res, next): Promise<any> => {
      const { code, email, userAgent } = verifyMfaForLoginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
      });

      const { user, accessToken, refreshToken } =
        await this.mfaService.verifyMfaForLogin(code, email, userAgent);
      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(StatusCodes.OK)
        .json({
          message: "Verified and logged in successfully",
          user,
        });
    }
  );
}
