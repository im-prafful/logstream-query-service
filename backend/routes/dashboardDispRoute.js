import express from 'express'
import { getDashboardLogs } from '../controllers/dashboardDispController.js';
import { jwtMiddleware } from '../middlewares/jwt.js';
const router=express.Router()

router.post('/logs',jwtMiddleware,getDashboardLogs)

export default router;
