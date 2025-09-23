import express from 'express'
import {
  getDashboardStats,
  getUserProductivityReport,
  getProjectReport,
  getTimeTrackingAnalysis,
  importTasksFromCSV,
  upload
} from '../controllers/reportController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

// Problema intencional: Sin middleware de validación de parámetros
router.get('/dashboard', authenticateToken, getDashboardStats)

// Problema intencional: Sin rate limiting específico para endpoints costosos
router.get('/productivity', authenticateToken, authorizeRoles('manager', 'admin'), getUserProductivityReport)

router.get('/projects', authenticateToken, getProjectReport)

// Problema intencional: Sin validación de parámetros de agrupación
router.get('/time-analysis', authenticateToken, getTimeTrackingAnalysis)

// Problema intencional: Sin límites de tamaño de archivo
router.post('/import-tasks', authenticateToken, upload.single('csvFile'), importTasksFromCSV)

// Problema intencional: Faltan endpoints para:
// - GET /reports/export-tasks (exportar tareas)
// - GET /reports/team-performance (rendimiento de equipos)
// - GET /reports/project-timeline (timeline de proyectos)
// - GET /reports/user-workload (carga de trabajo por usuario)

export default router