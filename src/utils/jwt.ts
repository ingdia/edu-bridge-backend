// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// ✅ Define Role type explicitly (matches Prisma schema enum)
// This avoids Prisma client import issues and is more flexible
export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Generate Access Token (short-lived)
 * @param payload - User data to encode
 * @returns JWT access token
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m', // Short expiration for security (SRS NFR 1)
  });
};

/**
 * Generate Refresh Token (long-lived)
 * @param payload - User data to encode
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN, // e.g., '7d' from .env
  });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};