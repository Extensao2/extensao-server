"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resourceController_1 = require("@/controllers/resourceController");
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const validation_2 = require("@/utils/validation");
const router = (0, express_1.Router)();
// Admin routes
router.put('/admin/resource', auth_1.authenticateToken, auth_1.requireAdmin, (0, validation_1.validateBody)(validation_2.resourceCreateSchema), resourceController_1.ResourceController.createResource);
router.patch('/admin/resource/:resource_id', auth_1.authenticateToken, auth_1.requireAdmin, (0, validation_1.validateParams)({ resource_id: validation_2.uuidSchema }), (0, validation_1.validateBody)(validation_2.resourceUpdateSchema), resourceController_1.ResourceController.updateResource);
router.delete('/admin/resource/:resource_id', auth_1.authenticateToken, auth_1.requireAdmin, (0, validation_1.validateParams)({ resource_id: validation_2.uuidSchema }), resourceController_1.ResourceController.deleteResource);
// User routes
router.get('/resource/:resource_id', auth_1.authenticateToken, (0, validation_1.validateParams)({ resource_id: validation_2.uuidSchema }), resourceController_1.ResourceController.getResource);
router.get('/resources/search', auth_1.authenticateToken, (0, validation_1.validateQuery)(validation_2.searchSchema), resourceController_1.ResourceController.searchResources);
exports.default = router;
//# sourceMappingURL=resources.js.map