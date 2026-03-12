// src/routes/passwordReset.routes.ts
import { Router } from 'express';
import {
  requestPasswordResetController,
  resetPasswordController,
  verifyResetTokenController,
} from '../controllers/passwordReset.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../validators/passwordReset.validator';
import { emailLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// POST /api/password-reset/request - Request password reset
router.post(
  '/request',
  emailLimiter,
  validate(requestPasswordResetSchema),
  requestPasswordResetController
);

// POST /api/password-reset/reset - Reset password with token
router.post('/reset', validate(resetPasswordSchema), resetPasswordController);

// GET /api/password-reset/verify?token=xxx - Verify reset token
router.get('/verify', verifyResetTokenController);

export default router;
