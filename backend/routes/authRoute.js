import express from 'express'
import { signupFnc , loginFnc} from '../controllers/authController.js'
import * as axios from 'axios';

const router=express.Router()

router.post('/signup',signupFnc)

router.post('/login', async (req, res, next) => {
    console.log("--- CAPTCHA MIDDLEWARE IS RUNNING ---"); // <-- Add this line
    let sever_secret = '6LdeYiwsAAAAABN7i_VqkIFa4QAltzRqVX5uj3Hd';
    const { captchaData } = req.body;
    try {
        const { data } = await axios.default.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${sever_secret}&response=${captchaData}`
        );

        if (data.success) {
            next();
        } else {

            console.error("reCAPTCHA Fail:", data['error-codes']);
            return res.status(400).json({
                message: 'reCAPTCHA verification failed.',
                // Frontend can use this to provide specific user feedback
                errorCode: data['error-codes']
            });
        }
    } catch (error) {
        // Handle network/server issues during the Google API call
        console.error("Error communicating with Google reCAPTCHA:", error);
        return res.status(500).json({ message: 'Internal server error during security check.' });
    }
}, loginFnc);

export default router