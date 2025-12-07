import express from 'express'
import {displayLogs} from '../controllers/dashboardDispController.js';

const router=express.Router()

router.get('/logs',displayLogs)


export default router;
