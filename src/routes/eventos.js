import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Evento from '../models/Evento.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all eventos (GET /eventos)
router.get('/eventos', async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ data: 1 });
    const response = eventos.map(evento => evento.toJSON());
    res.status(200).json(response);
  } catch (error) {
    console.error('Get eventos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create evento (POST /eventos)
router.post('/eventos', requireAuth, [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('data').isISO8601().withMessage('Data must be a valid datetime'),
  body('descricao').optional().isString().withMessage('Descricao must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, data, descricao } = req.body;

    const evento = new Evento({ nome, data, descricao });
    await evento.save();

    res.status(201).json(evento.toJSON());
  } catch (error) {
    console.error('Create evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get evento by ID (GET /eventos/:id)
router.get('/eventos/:id', [
  param('id').notEmpty().withMessage('Evento ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evento = await Evento.findOne({ id: req.params.id });
    if (!evento) {
      return res.status(404).json({ error: 'Evento not found' });
    }

    res.status(200).json(evento.toJSON());
  } catch (error) {
    console.error('Get evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update evento (PUT /eventos/:id)
router.put('/eventos/:id', requireAuth, [
  param('id').notEmpty().withMessage('Evento ID is required'),
  body('nome').notEmpty().withMessage('Nome is required'),
  body('data').isISO8601().withMessage('Data must be a valid datetime'),
  body('descricao').optional().isString().withMessage('Descricao must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, data, descricao } = req.body;

    const evento = await Evento.findOneAndUpdate(
      { id: req.params.id },
      { nome, data, descricao },
      { new: true, runValidators: true }
    );

    if (!evento) {
      return res.status(404).json({ error: 'Evento not found' });
    }

    res.status(200).json(evento.toJSON());
  } catch (error) {
    console.error('Update evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete evento (DELETE /eventos/:id)
router.delete('/eventos/:id', requireAuth, [
  param('id').notEmpty().withMessage('Evento ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evento = await Evento.findOneAndDelete({ id: req.params.id });
    if (!evento) {
      return res.status(404).json({ error: 'Evento not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete evento error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;