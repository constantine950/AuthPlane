import { type Request, type Response, type NextFunction } from "express";
import { AuditService } from "../services/audit.service";
import { sendSuccess } from "../utils/response";

export const AuditController = {
  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query["limit"] ? Number(req.query["limit"]) : 50;
      const logs = await AuditService.getLogs(limit);
      sendSuccess(res, { logs });
    } catch (error) {
      next(error);
    }
  },
};
