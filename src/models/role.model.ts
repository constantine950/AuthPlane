import pool from "../config/db";

export const RoleModel = {
  async findAll() {
    const result = await pool.query("SELECT * FROM roles ORDER BY name");
    return result.rows;
  },

  async findByName(name: string) {
    const result = await pool.query("SELECT * FROM roles WHERE name = $1", [
      name,
    ]);
    return result.rows[0] || null;
  },

  async findByUserId(userId: string) {
    const result = await pool.query(
      `SELECT r.* FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId],
    );
    return result.rows;
  },

  async assignToUser(userId: string, roleId: string) {
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, roleId],
    );
  },

  async removeFromUser(userId: string, roleId: string) {
    await pool.query(
      "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2",
      [userId, roleId],
    );
  },
};
