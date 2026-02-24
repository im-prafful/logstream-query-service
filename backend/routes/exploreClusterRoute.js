import express from 'express'
import { getLogsByClusterId } from '../controllers/exploreClustersCont.js'
import { jwtMiddleware } from '../middlewares/jwt.js'
import { authorize } from '../middlewares/rules_engine.js'

const router = express.Router()

router.get('/clusters/:clusterId/logs', jwtMiddleware, authorize('view_clusters'), getLogsByClusterId)

export default router