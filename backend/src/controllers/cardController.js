import { Card } from '../models/Card.js';
import { List } from '../models/List.js';

// Get all cards for a list
export const getCardsByList = async (req, res) => {
  try {
    const cards = await Card.getByListId(req.params.listId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single card
export const getCardById = async (req, res) => {
  try {
    const card = await Card.getById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new card
export const createCard = async (req, res) => {
  try {
    const { listId, title, description } = req.body;
    
    // Verify list exists
    const list = await List.getById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const maxPosition = await Card.getMaxPosition(listId);
    const newPosition = maxPosition + 1.0;

    const card = await Card.create(listId, title, description, newPosition);
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update card (title, description, completed status, or move to different list)
export const updateCard = async (req, res) => {
  try {
    const { title, description, listId, completed } = req.body;
    
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (listId !== undefined) {
      // Verify new list exists
      const list = await List.getById(listId);
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
      updates.list_id = listId;
    }

    const card = await Card.update(req.params.id, updates);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a card
export const deleteCard = async (req, res) => {
  try {
    await Card.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reorder cards within a list or move cards between lists
export const reorderCards = async (req, res) => {
  try {
    const { cardIds, listId } = req.body;
    
    if (!Array.isArray(cardIds)) {
      return res.status(400).json({ error: 'cardIds must be an array' });
    }
    if (!listId) {
      return res.status(400).json({ error: 'listId is required' });
    }

    // Verify list exists
    const list = await List.getById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // Update positions: assign 1.0, 2.0, 3.0, etc. based on array index
    // Also update list_id if card is being moved to a different list
    const updates = cardIds.map((id, index) => {
      const position = (index + 1) * 1.0;
      return Card.update(id, { list_id: listId, position });
    });

    await Promise.all(updates);
    
    // Return updated cards for the list
    const cards = await Card.getByListId(listId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
