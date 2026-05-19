import pool from "../config/db";

export const SessionModel = {
  async create(userId: string, device: string, ipAddress: string) {
    const result = await pool.query(
      `INSERT INTO sessions (user_id, device, ip_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, device, ipAddress],
    );
    return result.rows[0];
  },

  async updateLastActive(sessionId: string) {
    await pool.query(
      `UPDATE sessions SET last_active = NOW()
       WHERE id = $1`,
      [sessionId],
    );
  },

  async findByUserId(userId: string) {
    const result = await pool.query(
      `SELECT * FROM sessions
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY last_active DESC`,
      [userId],
    );
    return result.rows;
  },

  async revoke(sessionId: string) {
    await pool.query(
      `UPDATE sessions SET is_active = FALSE
       WHERE id = $1`,
      [sessionId],
    );
  },

  async revokeAllForUser(userId: string) {
    await pool.query(
      `UPDATE sessions SET is_active = FALSE
       WHERE user_id = $1`,
      [userId],
    );
  },
};
