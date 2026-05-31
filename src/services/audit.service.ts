import { AuditLogModel } from "../models/auditLog.model";

export const AuditService = {
  async log(
    userId: string | null,
    action: string,
    ipAddress: string,
    metadata?: object,
  ) {
    await AuditLogModel.create(userId, action, ipAddress, metadata);
  },

  async getLogs(limit?: number) {
    return await AuditLogModel.findAll(limit);
  },
};
