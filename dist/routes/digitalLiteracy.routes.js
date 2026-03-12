"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const digitalLiteracy_controller_1 = require("../controllers/digitalLiteracy.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const digitalLiteracy_validator_1 = require("../validators/digitalLiteracy.validator");
const router = (0, express_1.Router)();
// Student routes
router.post('/lessons/start', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), (0, validate_middleware_1.validate)(digitalLiteracy_validator_1.startLessonSchema), digitalLiteracy_controller_1.digitalLiteracyController.startLesson.bind(digitalLiteracy_controller_1.digitalLiteracyController));
router.post('/lessons/complete', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), (0, validate_middleware_1.validate)(digitalLiteracy_validator_1.completeLessonSchema), digitalLiteracy_controller_1.digitalLiteracyController.completeLesson.bind(digitalLiteracy_controller_1.digitalLiteracyController));
router.get('/my-progress', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), (0, validate_middleware_1.validate)(digitalLiteracy_validator_1.getLessonsQuerySchema), digitalLiteracy_controller_1.digitalLiteracyController.getMyProgress.bind(digitalLiteracy_controller_1.digitalLiteracyController));
router.get('/my-stats', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), digitalLiteracy_controller_1.digitalLiteracyController.getMyStats.bind(digitalLiteracy_controller_1.digitalLiteracyController));
// Mentor/Admin routes
router.get('/all-progress', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), (0, validate_middleware_1.validate)(digitalLiteracy_validator_1.getLessonsQuerySchema), digitalLiteracy_controller_1.digitalLiteracyController.getAllProgress.bind(digitalLiteracy_controller_1.digitalLiteracyController));
exports.default = router;
//# sourceMappingURL=digitalLiteracy.routes.js.map