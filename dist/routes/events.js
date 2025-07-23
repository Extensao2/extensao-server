"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("@/controllers/eventController");
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const validation_2 = require("@/utils/validation");
const router = (0, express_1.Router)();
router.get('/events', auth_1.authenticateToken, eventController_1.EventController.getAllEvents);
router.get('/admin/events/:user_id', auth_1.authenticateToken, auth_1.requireAdmin, (0, validation_1.validateParams)({ user_id: validation_2.uuidSchema }), eventController_1.EventController.getEventsByUserId);
exports.default = router;
//# sourceMappingURL=events.js.map