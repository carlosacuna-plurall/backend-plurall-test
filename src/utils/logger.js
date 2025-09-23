import winston from 'winston'

// Problema intencional: Configuración de logging básica
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'plurall-backend' },
  transports: [
    // Problema intencional: Solo logs en archivo, sin rotación
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

// Problema intencional: Console log siempre habilitado
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// Problema intencional: Sin configuración para diferentes niveles según ambiente
export default logger