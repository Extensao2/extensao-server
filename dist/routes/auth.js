"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("@/controllers/authController");
const validation_1 = require("@/middleware/validation");
const validation_2 = require("@/utils/validation");
const router = (0, express_1.Router)();
router.post('/login', (0, validation_1.validateBody)(validation_2.loginSchema), authController_1.AuthController.login);
exports.default = router;
//# sourceMappingURL=auth.js.map