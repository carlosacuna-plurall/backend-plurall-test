import rateLimit from 'express-rate-limit'

// Problema intencional: Rate limiting muy permisivo
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Problema: 1000 requests es demasiado permisivo
  message: {
    error: 'Demasiadas peticiones, intenta más tarde',
    // Problema intencional: Expone información interna
    limit: 1000,
    windowMs: 15 * 60 * 1000
  },
  // Problema intencional: No personaliza por endpoint
  standardHeaders: true,
  legacyHeaders: false,
})

// Problema intencional: Rate limiter para auth muy básico
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 intentos de login por IP
  message: {
    error: 'Demasiados intentos de login, intenta más tarde',
  },
  // Problema intencional: Sin skipSuccessfulRequests
  skipSuccessfulRequests: false
})