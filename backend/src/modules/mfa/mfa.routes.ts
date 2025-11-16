import { Router } from "express";
import { authenticateJwt } from "../../common/strategies/jwt.strategy";
import { mfaController } from "./mfa.module";

const mfaRouter = Router();

mfaRouter.get("/setup", authenticateJwt, mfaController.generateMfaSetup);
mfaRouter.post("/verify", authenticateJwt, mfaController.verifyMfaSetup);
mfaRouter.put("/revoke", authenticateJwt, mfaController.revokeMfa);
mfaRouter.post("/verify-login", mfaController.verifyMfaForLogin);

export default mfaRouter;
