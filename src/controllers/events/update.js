import { param, body, validationResult } from 'express-validator';
import Evento from '../../models/Evento.js';

export const updateEventValidators = [
  param('id').notEmpty().withMessage('Evento ID is required'),
  body('nome').notEmpty().withMessage('Nome is required'),
  body('data').isISO8601().withMessage('Data must be a valid datetime'),
  body('descricao').optional().isString().withMessage('Descricao must be a string')
];

export const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, data, descricao } = req.body;

    const evento = await Evento.findOneAndUpdate(
      { id: req.params.id },
      { nome, data, descricao },
      { new: true, runValidators: true }
    );

    if (!evento) return res.status(404).json({ error: 'Evento not found' });

    res.status(200).json(evento.toJSON());
  } catch (error) {
    console.error('Update evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};