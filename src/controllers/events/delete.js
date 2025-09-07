import { param, validationResult } from 'express-validator';
import Evento from '../../models/Evento.js';

export const deleteEventValidators = [
  param('id').notEmpty().withMessage('Evento ID is required')
];

export const deleteEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const evento = await Evento.findOneAndDelete({ id: req.params.id });
    if (!evento) return res.status(404).json({ error: 'Evento not found' });

    res.status(204).send();
  } catch (error) {
    console.error('Delete evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};