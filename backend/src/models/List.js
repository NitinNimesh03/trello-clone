import pool from '../config/database.js';

export class List {
  // Get all lists ordered by position
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM lists ORDER BY position ASC'
    );
    return rows;
  }

  // Get a single list by ID
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM lists WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create a new list
  static async create(title, position) {
    const [result] = await pool.execute(
      'INSERT INTO lists (title, position) VALUES (?, ?)',
      [title, position]
    );
    return this.getById(result.insertId);
  }

  // Update list title
  static async update(id, title) {
    await pool.execute(
      'UPDATE lists SET title = ? WHERE id = ?',
      [title, id]
    );
    return this.getById(id);
  }

  // Delete a list (cascade will delete cards)
  static async delete(id) {
    await pool.execute('DELETE FROM lists WHERE id = ?', [id]);
    return { success: true };
  }

  // Update list position
  static async updatePosition(id, position) {
    await pool.execute(
      'UPDATE lists SET position = ? WHERE id = ?',
      [position, id]
    );
    return this.getById(id);
  }

  // Get maximum position (for appending new lists)
  static async getMaxPosition() {
    const [rows] = await pool.execute(
      'SELECT MAX(position) as maxPosition FROM lists'
    );
    return rows[0]?.maxPosition || 0;
  }
}
