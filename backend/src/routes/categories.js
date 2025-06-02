const express = require('express');
const router = express.Router();
// The categoryController will be created in a different batch.
// For now, we define the routes and assume the controller will exist.
const categoryController = require('../controllers/categoryController');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST create a new category
router.post('/', categoryController.createCategory);

// GET a single category by ID
router.get('/:id', categoryController.getCategoryById);

// PUT update a category by ID
router.put('/:id', categoryController.updateCategory);

// DELETE a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;