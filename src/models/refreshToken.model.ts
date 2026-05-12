import pool from "../config/db";

export const RefreshTokenModel = {
  async create(userId: string, token: string, expiresAt: Date) {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, token, expiresAt],
    );
    return result.rows[0];
  },

  async findByToken(token: string) {
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
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
