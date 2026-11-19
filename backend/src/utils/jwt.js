import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';

export function signAccessToken(userId, expiresInOverride) {
  const { jwtSecret, jwtExpiresIn } = getEnv();
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured.');
  }
  return jwt.sign({ sub: String(userId) }, jwtSecret, {
    expiresIn: expiresInOverride || jwtExpiresIn,
  });
}

export function verifyAccessToken(token) {
  const { jwtSecret } = getEnv();
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured.');
  }
  return jwt.verify(token, jwtSecret);
}
