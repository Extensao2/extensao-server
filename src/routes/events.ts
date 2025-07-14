import { Router } from 'express';
import { EventController } from '@/controllers/eventController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { validateParams } from '@/middleware/validation';
import { uuidSchema } from '@/utils/validation';

const router = Router();

router.get(
  '/events',
  authenticateToken,
  EventController.getAllEvents
);

router.get(
  '/admin/events/:user_id',
  authenticateToken,
  requireAdmin,
  validateParams({ user_id: uuidSchema }),
  EventController.getEventsByUserId
);

export default router;