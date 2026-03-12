"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailLimiter = exports.uploadLimiter = exports.authLimiter = exports.apiLimiter = void 0;
// src/middlewares/rateLimiter.middleware.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General API rate limiter - 100 requests per 15 minutes
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Strict limiter for auth endpoints - 5 requests per 15 minutes
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
});
// File upload limiter - 20 uploads per hour
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: 'Too many file uploads, please try again later.',
});
// Email limiter - 10 emails per hour
exports.emailLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many email requests, please try again later.',
});
//# sourceMappingURL=rateLimiter.middleware.js.map