import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Resource from '../models/Resource.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


const findResourceOrFail = async (id) => {
  const resource = await Resource.findOne({ id });
  if (!resource) {
    const error = new Error('Resource not found');
    error.status = 404;
    throw error;
  }
  return resource;
};


router.put('/resource', requireAuth, validate([
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
]), async (req, res) => {
  try {
    const { title, content } = req.body;
    const resource = new Resource({ title, content, createdBy: req.user._id });
    await resource.save();
    res.status(201).json({ id: resource.id });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/resource/:id', validate([
  param('id').notEmpty().withMessage('Resource ID is required')
]), async (req, res) => {
  try {
    const resource = await findResourceOrFail(req.params.id);
    res.status(200).json(resource.toJSON());
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});


router.patch('/resource/:id', requireAuth, validate([
  param('id').notEmpty().withMessage('Resource ID is required'),
  body().custom(value => {
    if (!value.title && !value.content) {
      throw new Error('At least one field (title or content) must be provided');
    }
    return true;
  })
]), async (req, res) => {
  try {
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


router.delete('/resource/:id', requireAuth, validate([
  param('id').notEmpty().withMessage('Resource ID is required')
]), async (req, res) => {
  try {
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


router.get('/resources/search', validate([
  query('title').optional().isString().withMessage('Title must be a string')
]), async (req, res) => {
  try {
    const { title } = req.query;
    const queryObj = title ? { title: { $regex: title, $options: 'i' } } : {};
    const resources = await Resource.find(queryObj).sort({ createdAt: -1 });
    res.status(200).json(resources.map(r => r.toJSON()));
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
