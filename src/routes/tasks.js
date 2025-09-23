import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment
} from '../controllers/taskController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

// Problema intencional: Sin middleware de validación de entrada
router.post('/', authenticateToken, createTask)
router.get('/', authenticateToken, getTasks)
router.get('/:id', authenticateToken, getTaskById)

// Problema intencional: Sin verificación de permisos específicos
router.put('/:id', authenticateToken, updateTask)
router.delete('/:id', authenticateToken, deleteTask)

// Problema intencional: Sin validación de parámetros
router.post('/:id/comments', authenticateToken, addComment)

// Problema intencional: Sin endpoints para:
// - Obtener tareas asignadas al usuario actual
// - Marcar tarea como completada
// - Obtener estadísticas de tareas

export default router