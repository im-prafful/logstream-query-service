import express from 'express'
import { jwtMiddleware } from '../middlewares/jwt.js';
import { authorize } from '../middlewares/rules_engine.js';
import { viewIncidents, viewIncidentById, createIncident, updateIncById, updateHistory, viewIncidentHistory } from '../controllers/incidentsController.js';

const router = express.Router()

router.get('/incidents', jwtMiddleware, authorize('manage_incidents', 'read'), viewIncidents)

router.get('/incident/:incident_id', jwtMiddleware, viewIncidentById)

router.post('/incidents', jwtMiddleware, authorize('manage_incidents', 'create'), createIncident)

//update Incident table
router.put('/incident/:incident_id', jwtMiddleware, authorize('manage_incidents', 'update'), updateIncById)

//update incident-history table
router.post('/incident/history', jwtMiddleware, updateHistory)

//get incident history
router.get('/incident/history/:incident_id', jwtMiddleware, viewIncidentHistory)

export default router;
