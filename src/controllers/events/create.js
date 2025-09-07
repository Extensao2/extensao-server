import { body, validationResult } from 'express-validator';
import Evento from '../../models/Evento.js';

export const createEventValidators = [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('data').isISO8601().withMessage('Data must be a valid datetime'),
  body('descricao').optional().isString().withMessage('Descricao must be a string')
];

export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, data, descricao } = req.body;

    const evento = new Evento({
      nome,
      data,
      descricao,
      createdBy: req.user._id
    });

    await evento.save();
    res.status(201).json(evento.toJSON());
  } catch (error) {
    console.error('Create evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};