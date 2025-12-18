import express from 'express'
import {displayLogs} from '../controllers/dashboardDispController.js';
import { jwtMiddleware } from '../middlewares/jwt.js';
const router=express.Router()

router.get('/logs',jwtMiddleware,displayLogs)


export default router;
