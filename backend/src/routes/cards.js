import express from 'express';
import {
  getCardsByList,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  reorderCards
} from '../controllers/cardController.js';

const router = express.Router();

router.get('/list/:listId', getCardsByList);
router.post('/', createCard);
router.post('/reorder', reorderCards); // Must come before /:id
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;
