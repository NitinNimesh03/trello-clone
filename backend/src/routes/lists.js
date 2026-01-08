import express from 'express';
import {
  getAllLists,
  getListById,
  createList,
  updateList,
  deleteList,
  reorderLists
} from '../controllers/listController.js';

const router = express.Router();

router.get('/', getAllLists);
router.post('/', createList);
router.post('/reorder', reorderLists); // Must come before /:id
router.get('/:id', getListById);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
