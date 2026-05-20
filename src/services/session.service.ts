import { SessionModel } from "../models/session.model";
import { AppError } from "../middleware/error.middleware";

export const SessionService = {
  async getActiveSessions(userId: string) {
    const sessions = await SessionModel.findByUserId(userId);
    return sessions;
  },

  async revokeSession(userId: string, sessionId: string) {
    const sessions = await SessionModel.findByUserId(userId);

    // Make sure session belongs to this user
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }

    await SessionModel.revoke(sessionId);
  },

  async revokeAllSessions(userId: string) {
    await SessionModel.revokeAllForUser(userId);
  },
};
