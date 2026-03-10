// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
// ✅ SINGLE SOURCE: Import Role directly from Prisma client
import { Role as PrismaRole } from '@prisma/client';

// ✅ Re-export Prisma's Role type for consistent usage across the app
export type Role = PrismaRole;

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role; // Now uses Prisma's canonical Role type
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};