import { param, validationResult } from 'express-validator';
import Resource from '../../models/Resource.js';

export const deleteResourceValidators = [
  param('id').notEmpty().withMessage('Resource ID is required')
];

export const deleteResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const resource = await Resource.findOneAndDelete({ id: req.params.id });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    res.status(204).send();
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};