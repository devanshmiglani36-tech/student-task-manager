import { getEnv } from '../config/env.js';

export function notFoundHandler(_req, res) {
  return res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err, _req, res, _next) {
  const { nodeEnv } = getEnv();

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid resource identifier' });
  }

  if (err.name === 'ValidationError') {
    const firstMsg = Object.values(err.errors || {})[0]?.message;
    return res.status(400).json({ error: firstMsg || 'Validation failed' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON request body' });
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 500 && nodeEnv !== 'test') {
    console.error('[Error]', err);
  }

  return res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
}
