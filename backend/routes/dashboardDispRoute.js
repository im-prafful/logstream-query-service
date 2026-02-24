import express from 'express'
import { getDashboardLogs, getFilteredLogs } from '../controllers/dashboardDispController.js';
import { jwtMiddleware } from '../middlewares/jwt.js';
import { authorize } from '../middlewares/rules_engine.js';
const router = express.Router()

router.get('/logs', jwtMiddleware, authorize('view_logs'), getDashboardLogs)
router.post('/category_logs', jwtMiddleware, authorize('view_logs'), getFilteredLogs)
export default router;
