"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/passwordReset.routes.ts
const express_1 = require("express");
const passwordReset_controller_1 = require("../controllers/passwordReset.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const passwordReset_validator_1 = require("../validators/passwordReset.validator");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
// POST /api/password-reset/request - Request password reset
router.post('/request', rateLimiter_middleware_1.emailLimiter, (0, validate_middleware_1.validate)(passwordReset_validator_1.requestPasswordResetSchema), passwordReset_controller_1.requestPasswordResetController);
// POST /api/password-reset/reset - Reset password with token
router.post('/reset', (0, validate_middleware_1.validate)(passwordReset_validator_1.resetPasswordSchema), passwordReset_controller_1.resetPasswordController);
// GET /api/password-reset/verify?token=xxx - Verify reset token
router.get('/verify', passwordReset_controller_1.verifyResetTokenController);
exports.default = router;
//# sourceMappingURL=passwordReset.routes.js.map