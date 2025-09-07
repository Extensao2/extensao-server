import { query, validationResult } from 'express-validator';
import Resource from '../../models/Resource.js';

export const searchResourcesValidators = [
  query('title').optional().isString().withMessage('Title must be a string')
];

export const searchResources = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title } = req.query;
    const queryObj = title ? { title: { $regex: title, $options: 'i' } } : {};

    const resources = await Resource.find(queryObj).sort({ createdAt: -1 });
    const response = resources.map(r => r.toJSON());

    res.status(200).json(response);
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};