import express from 'express'
import { jwtMiddleware } from '../middlewares/jwt.js';
import { authorize } from '../middlewares/rules_engine.js';
import { viewIncidents, createIncident, deleteIncident } from '../controllers/incidentsController.js';

const router = express.Router()

router.get('/incidents', jwtMiddleware, authorize('manage_incidents', 'read'), viewIncidents)

router.post('/incidents', jwtMiddleware, authorize('manage_incidents', 'create'), createIncident)

router.delete('/incidents', jwtMiddleware, authorize('manage_incidents', 'delete'), deleteIncident)

export default router;
