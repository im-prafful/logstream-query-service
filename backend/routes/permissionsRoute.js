import express from 'express'
import { jwtMiddleware } from '../middlewares/jwt.js';
import { authorize } from '../middlewares/rules_engine.js';
import { viewIncidents, viewIncidentById, createIncident } from '../controllers/incidentsController.js';

const router = express.Router()

router.get('/incidents', jwtMiddleware, authorize('manage_incidents', 'read'), viewIncidents)
router.get('/incident/:incident_id', jwtMiddleware, viewIncidentById)

router.post('/incidents', jwtMiddleware, authorize('manage_incidents', 'create'), createIncident)

export default router;
