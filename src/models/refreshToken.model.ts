import pool from "../config/db";

export const RefreshTokenModel = {
  async create(
    userId: string,
    token: string,
    expiresAt: Date,
    sessionId: string,
  ) {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at, session_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, token, expiresAt, sessionId],
    );
    return result.rows[0];
  },

  async findByToken(token: string) {
    const result = await pool.query(
      `SELECT rt.*, u.email 
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1`,
      [token],
    );
    return result.rows[0] || null;
  },

  async revoke(token: string) {
    await pool.query(
      "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1",
      [token],
    );
  },
};
