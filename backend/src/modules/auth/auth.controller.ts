import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middlewares/asyncController";
import { AuthService } from "./auth.service";

export class AuthController {
    private authService: AuthService;

    constructor(authService:AuthService) {
        this.authService = authService
    }

    public register = asyncHandler(async (req, res, next): Promise<any> => {
        return res.status(StatusCodes.CREATED).json({
            message: "User registered successfully",
        })
    })
}