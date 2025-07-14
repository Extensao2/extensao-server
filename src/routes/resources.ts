import { Router } from 'express';
import { ResourceController } from '@/controllers/resourceController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { 
  resourceCreateSchema, 
  resourceUpdateSchema, 
  uuidSchema,
  searchSchema 
} from '@/utils/validation';

const router = Router();

// Admin routes
router.put(
  '/admin/resource',
  authenticateToken,
  requireAdmin,
  validateBody(resourceCreateSchema),
  ResourceController.createResource
);

router.patch(
  '/admin/resource/:resource_id',
  authenticateToken,
  requireAdmin,
  validateParams({ resource_id: uuidSchema }),
  validateBody(resourceUpdateSchema),
  ResourceController.updateResource
);

router.delete(
  '/admin/resource/:resource_id',
  authenticateToken,
  requireAdmin,
  validateParams({ resource_id: uuidSchema }),
  ResourceController.deleteResource
);

// User routes
router.get(
  '/resource/:resource_id',
  authenticateToken,
  validateParams({ resource_id: uuidSchema }),
  ResourceController.getResource
);

router.get(
  '/resources/search',
  authenticateToken,
  validateQuery(searchSchema),
  ResourceController.searchResources
);

export default router;