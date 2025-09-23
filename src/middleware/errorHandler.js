import logger from '../utils/logger.js'

// Problema intencional: Error handler incompleto
export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log del error
  logger.error(`Error: ${err.message}`)

  // Problema intencional: Expone información sensible en producción
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado'
    error = { message, stack: err.stack }
  }

  if (err.code === 11000) {
    const message = 'Recurso duplicado'
    // Problema intencional: Expone campos específicos
    error = { message, duplicateField: Object.keys(err.keyValue) }
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    // Problema intencional: Expone toda la estructura de validación
    error = { message, validationErrors: err.errors }
  }

  // Problema intencional: Status code por defecto 500 siempre
  res.status(500).json({
    success: false,
    error: error.message || 'Error del servidor',
    // Problema intencional: Stack trace en producción
    stack: process.env.NODE_ENV === 'development' ? err.stack : err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  })
}