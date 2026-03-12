"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/profilePhoto.routes.ts
const express_1 = require("express");
const profilePhoto_controller_1 = require("../controllers/profilePhoto.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
// POST /api/profile-photo - Upload profile photo
router.post('/', auth_middleware_1.authenticate, rateLimiter_middleware_1.uploadLimiter, upload_middleware_1.uploadImage, profilePhoto_controller_1.uploadProfilePhotoController);
// DELETE /api/profile-photo - Delete profile photo
router.delete('/', auth_middleware_1.authenticate, profilePhoto_controller_1.deleteProfilePhotoController);
exports.default = router;
//# sourceMappingURL=profilePhoto.routes.js.map