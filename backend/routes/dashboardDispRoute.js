import express from 'express'
import { getDashboardLogs, getFilteredLogs } from '../controllers/dashboardDispController.js';
import { jwtMiddleware } from '../middlewares/jwt.js';
const router=express.Router()

router.get('/logs',jwtMiddleware,getDashboardLogs)
router.post('/category_logs',jwtMiddleware,getFilteredLogs)
export default router;
