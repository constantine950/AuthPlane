import pool from "../config/db";

export const ApiKeyModel = {
  async create(name: string, keyHash: string) {
    const result = await pool.query(
      `INSERT INTO api_keys (name, key_hash)
       VALUES ($1, $2) RETURNING *`,
      [name, keyHash],
    );
    return result.rows[0];
  },

  async findByHash(keyHash: string) {
    const result = await pool.query(
      `SELECT * FROM api_keys WHERE key_hash = $1 AND is_active = TRUE`,
      [keyHash],
    );
    return result.rows[0] || null;
  },

  async revoke(id: string) {
    await pool.query(`UPDATE api_keys SET is_active = FALSE WHERE id = $1`, [
      id,
    ]);
  },
};
