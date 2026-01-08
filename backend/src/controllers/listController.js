import { List } from '../models/List.js';

// Get all lists
export const getAllLists = async (req, res) => {
  try {
    const lists = await List.getAll();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single list
export const getListById = async (req, res) => {
  try {
    const list = await List.getById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new list
export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const maxPosition = await List.getMaxPosition();
    const newPosition = maxPosition + 1.0;

    const list = await List.create(title, newPosition);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update list title
export const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const list = await List.update(req.params.id, title);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a list
export const deleteList = async (req, res) => {
  try {
    await List.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reorder lists (drag & drop)
export const reorderLists = async (req, res) => {
  try {
    const { listIds } = req.body; // Array of list IDs in new order
    if (!Array.isArray(listIds)) {
      return res.status(400).json({ error: 'listIds must be an array' });
    }

    // Update positions: assign 1.0, 2.0, 3.0, etc. based on array index
    const updates = listIds.map((id, index) => 
      List.updatePosition(id, (index + 1) * 1.0)
    );

    await Promise.all(updates);
    const lists = await List.getAll();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
