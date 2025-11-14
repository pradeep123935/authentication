import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middlewares/asyncController";
import { AuthService } from "./auth.service";
import { registerSchema } from "../../validators/auth.validator";

export class AuthController {
    private authService: AuthService;

    constructor(authService:AuthService) {
        this.authService = authService
    }

    public register = asyncHandler(async (req, res, next): Promise<any> => {
        const userAgent = req.headers["user-agent"];
        const body = registerSchema.parse({
            ...req.body,
            userAgent
        })
        this.authService.register(body);
        return res.status(StatusCodes.CREATED).json({
            message: "User registered successfully",
        })
    })
}