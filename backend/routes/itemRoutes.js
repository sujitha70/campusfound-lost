const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Public and Protected routes on /api/items
router.route('/')
  .get(getItems)
  .post(protect, createItem);

// Specific route for current user's items (placed before /:id)
router.get('/user/me', protect, getMyItems);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;

