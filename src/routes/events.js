import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { eventController } from '../controllers/events/index.js';

const router = express.Router();

// GET /events
router.get('/', eventController.getAllEvents);

// POST /events
router.post('/', requireAuth, eventController.createEventValidators, eventController.createEvent);

// GET /events/:id
router.get('/:id', eventController.getEventByIdValidators, eventController.getEventById);

// PUT /events/:id
router.put('/:id', requireAuth, eventController.updateEventValidators, eventController.updateEvent);

// DELETE /events/:id
router.delete('/:id', requireAuth, eventController.deleteEventValidators, eventController.deleteEvent);

export default router;
