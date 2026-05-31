import pool from "../config/db";

export const AuditLogModel = {
  async create(
    userId: string | null,
    action: string,
    ipAddress: string,
    metadata?: object,
  ) {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, action, ipAddress, metadata ? JSON.stringify(metadata) : null],
    );
  },

  async findAll(limit = 50) {
    const result = await pool.query(
      `SELECT al.*, u.email 
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1`,
      [limit],
    );
    return result.rows;
  },
};
