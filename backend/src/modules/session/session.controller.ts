import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middlewares/asyncController";
import { SessionService } from "./session.service";
import { NotFoundException } from "../../utils/catch-errors";
import z from "zod";

export class SessionController {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public getAllSession = asyncHandler(async (req, res, next): Promise<any> => {
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    const { sessions } = await this.sessionService.getAllSession(userId);

    const modifySessions = sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === sessionId && { isCurrentSession: true }),
    }));
    res.status(StatusCodes.OK).json({
      message: "Sessions fetched successfully",
      sessions: modifySessions,
    });
  });

  public getSession = asyncHandler(async (req, res, next): Promise<any> => {
    const sessionId = req.sessionId;

    if (!sessionId) {
      throw new NotFoundException("Session not found");
    }

    const { user } = await this.sessionService.getSessionById(sessionId);

    return res.status(StatusCodes.OK).json({
      message: "Session fetched successfully",
      user,
    });
  });

  public deleteSession = asyncHandler(async (req, res, next): Promise<any> => {
    const sessionId = z.string().parse(req.params.id);
    const userId = req.user?.id;
    await this.sessionService.deleteSession(sessionId, userId);
    return res.status(StatusCodes.OK).json({
      message: "Session deleted successfully",
    });
  });
}
