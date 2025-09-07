import { param, validationResult } from 'express-validator';
import Evento from '../../models/Evento.js';

export const getEventByIdValidators = [
  param('id').notEmpty().withMessage('Evento ID is required')
];

export const getEventById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const evento = await Evento.findOne({ id: req.params.id });
    if (!evento) return res.status(404).json({ error: 'Evento not found' });

    res.status(200).json(evento.toJSON());
  } catch (error) {
    console.error('Get evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};