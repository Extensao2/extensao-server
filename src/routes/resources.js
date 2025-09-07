import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { resourceController } from '../controllers/resources/index.js';

const router = express.Router();

// Create resource (PUT /resource)
router.put(
  '/resource',
  requireAuth,
  resourceController.createResourceValidators,
  resourceController.createResource
);

// Get resource by ID (GET /resource/:id)
router.get(
  '/resource/:id',
  resourceController.getResourceByIdValidators,
  resourceController.getResourceById
);

// Update resource (PATCH /resource/:id)
router.patch(
  '/resource/:id',
  requireAuth,
  resourceController.updateResourceValidators,
  resourceController.updateResource
);

// Delete resource (DELETE /resource/:id)
router.delete(
  '/resource/:id',
  requireAuth,
  resourceController.deleteResourceValidators,
  resourceController.deleteResource
);

// Search resources (GET /resources/search)
router.get(
  '/resources/search',
  resourceController.searchResourcesValidators,
  resourceController.searchResources
);

export default router;
