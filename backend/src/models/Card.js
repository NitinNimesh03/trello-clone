import pool from '../config/database.js';

export class Card {
  // Get all cards for a list, ordered by position
  static async getByListId(listId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cards WHERE list_id = ? ORDER BY position ASC',
      [listId]
    );
    return rows;
  }

  // Get a single card by ID
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM cards WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create a new card
  static async create(listId, title, description, position) {
    const [result] = await pool.execute(
      'INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)',
      [listId, title || '', description || '', position]
    );
    return this.getById(result.insertId);
  }

  // Update card
  static async update(id, updates) {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.list_id !== undefined) {
      fields.push('list_id = ?');
      values.push(updates.list_id);
    }
    if (updates.position !== undefined) {
      fields.push('position = ?');
      values.push(updates.position);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.getById(id);
  }

  // Delete a card
  static async delete(id) {
    await pool.execute('DELETE FROM cards WHERE id = ?', [id]);
    return { success: true };
  }

  // Get maximum position for cards in a list
  static async getMaxPosition(listId) {
    const [rows] = await pool.execute(
      'SELECT MAX(position) as maxPosition FROM cards WHERE list_id = ?',
      [listId]
    );
    return rows[0]?.maxPosition || 0;
  }
}
