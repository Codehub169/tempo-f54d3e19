const express = require('express');
const router = express.Router();
// The tagController will be created in a different batch.
// For now, we define the routes and assume the controller will exist.
const tagController = require('../controllers/tagController');

// GET all tags
router.get('/', tagController.getAllTags);

// POST create a new tag
router.post('/', tagController.createTag);

// GET a single tag by ID
router.get('/:id', tagController.getTagById);

// PUT update a tag by ID
router.put('/:id', tagController.updateTag);

// DELETE a tag by ID
router.delete('/:id', tagController.deleteTag);

module.exports = router;