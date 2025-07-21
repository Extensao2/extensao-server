import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Resource from '../models/Resource.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create resource (PUT /resource)
router.put('/resource', requireAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    const resource = new Resource({ title, content });
    await resource.save();

    res.status(201).json({ id: resource.id });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resource by ID (GET /resource/:id)
router.get('/resource/:id', [
  param('id').notEmpty().withMessage('Resource ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resource = await Resource.findOne({ id: req.params.id });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(resource.toJSON());
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update resource (PATCH /resource/:id)
router.patch('/resource/:id', requireAuth, [
  param('id').notEmpty().withMessage('Resource ID is required'),
  body().custom((value) => {
    if (!value.title && !value.content) {
      throw new Error('At least one field (title or content) must be provided');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const resource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json({ id: resource.id });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resource (DELETE /resource/:id)
router.delete('/resource/:id', requireAuth, [
  param('id').notEmpty().withMessage('Resource ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resource = await Resource.findOneAndDelete({ id: req.params.id });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search resources (GET /resources/search)
router.get('/resources/search', [
  query('title').optional().isString().withMessage('Title must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    const response = resources.map(resource => resource.toJSON());

    res.status(200).json(response);
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;