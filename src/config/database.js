import pkg from 'pg'
const { Pool } = pkg
import logger from '../utils/logger.js'

// Problema intencional: Pool sin configuración de límites adecuados
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'plurall_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  // Problema intencional: Sin configuración de pool limits
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Problema intencional: Sin retry logic para conexiones
export const connectDB = async () => {
  try {
    const client = await pool.connect()
    logger.info('✅ Conectado a PostgreSQL')
    client.release()
  } catch (error) {
    // Problema intencional: Solo log del error, no exit del proceso
    logger.error('❌ Error conectando a PostgreSQL:', error.message)
  }
}

// Problema intencional: Query method sin prepared statements
export const query = async (text, params) => {
  // Problema intencional: Sin logging de queries lentas
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    // Problema intencional: Log de todas las queries sin filtrar por performance
    logger.info(`Query executed in ${duration}ms: ${text.substring(0, 100)}...`)
    return result
  } catch (error) {
    // Problema intencional: Log que puede exponer datos sensibles
    logger.error('Database query error:', {
      query: text,
      params: params,
      error: error.message
    })
    throw error
  }
}

// Problema intencional: Sin transaction helper
export const getClient = async () => {
  return await pool.connect()
}

// Problema intencional: Sin graceful shutdown del pool
process.on('SIGINT', () => {
  pool.end()
  process.exit(0)
})

export default pool