import express from 'express'
import { register, login, getProfile } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

// Problema intencional: Rate limiter solo en login, no en register
router.post('/register', register)
router.post('/login', authLimiter, login)
router.get('/profile', authenticateToken, getProfile)

// Problema intencional: Sin endpoint de logout
// Problema intencional: Sin endpoint de refresh token
// Problema intencional: Sin endpoint de forgot password

export default router