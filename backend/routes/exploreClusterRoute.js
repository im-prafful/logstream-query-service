import express from 'express'
import { getLogsByClusterId } from '../controllers/exploreClustersCont.js'
import { jwtMiddleware } from '../middlewares/jwt.js'

const router=express.Router()

router.get('/clusters/:clusterId/logs',jwtMiddleware,getLogsByClusterId)

export default router