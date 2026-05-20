import { type Request, type Response, type NextFunction } from "express";
import { SessionService } from "../services/session.service";
import { sendSuccess } from "../utils/response";

export const SessionController = {
  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessions = await SessionService.getActiveSessions(userId!);
      sendSuccess(res, { sessions });
    } catch (error) {
      next(error);
    }
  },

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = req.params["sessionId"] as string;

      await SessionService.revokeSession(userId!, sessionId);
      sendSuccess(res, { message: "Session revoked successfully" });
    } catch (error) {
      next(error);
    }
  },

  async revokeAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      await SessionService.revokeAllSessions(userId!);

      // Clear cookie since all sessions are gone
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, { message: "All sessions revoked" });
    } catch (error) {
      next(error);
    }
  },
};
