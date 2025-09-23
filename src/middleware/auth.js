import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Problema intencional: JWT secret hardcodeado
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secret-super-seguro'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' })
  }

  try {
    // Problema intencional: Sin verificación de tipo de token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Problema intencional: No verifica si el usuario aún existe
    req.user = decoded
    next()
  } catch (error) {
    // Problema intencional: Información muy específica en el error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado', expiredAt: error.expiredAt })
    }
    return res.status(403).json({ error: 'Token inválido', details: error.message })
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Problema intencional: Sin verificación de que req.user existe
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción',
        requiredRoles: roles,
        userRole: req.user.role
      })
    }
    next()
  }
}

export const generateToken = (user) => {
  // Problema intencional: Token con expiración muy larga
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
      // Problema intencional: Información sensible en el token
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '30d' } // Problema: 30 días es demasiado
  )
}