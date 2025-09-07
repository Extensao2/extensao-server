import { param, body, validationResult } from 'express-validator';
import Resource from '../../models/Resource.js';

export const updateResourceValidators = [
  param('id').notEmpty().withMessage('Resource ID is required'),
  body().custom((value) => {
    if (!value.title && !value.content) {
      throw new Error('At least one field (title or content) must be provided');
    }
    return true;
  })
];

export const updateResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, content } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const resource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    res.status(200).json({ id: resource.id });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
