"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
// src/utils/password.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12; // NFR 1: Security - High salt rounds for password hashing
/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
const hashPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map