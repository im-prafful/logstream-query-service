import express from 'express'
import {displayLogs1,displayLogs2} from '../controllers/dashboardDispController.js';
import { jwtMiddleware } from '../middlewares/jwt.js';
const router=express.Router()

router.get('/logs',jwtMiddleware,displayLogs1)
router.get('/logsOnCategory',displayLogs2)

export default router;
