import express from 'express'
import { signupFnc , loginFnc} from '../controllers/authController'


const router=express.Router()

router.post('/signup',signupFnc)
router.post('/login',loginFnc)

export default router