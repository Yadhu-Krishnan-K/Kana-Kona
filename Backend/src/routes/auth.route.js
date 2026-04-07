import express from "express";
import { login, logout, signup, verifyOtp,checkAuth,updateProfile, forgotPasswordEmailVerification, verifyOtpAndUpdatePassword, resendOtp } from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.js";
import limiter from "../middlewares/rate_limit.js";
import { validate } from "../middlewares/validate.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "../lib/zodValidation.js";

const router = express.Router()

router.post('/signup', limiter, validate(signupSchema), signup)
router.post('/verifyOtp', limiter, verifyOtp)
router.post('/resend-otp',limiter,resendOtp)
router.post('/login', limiter, validate(loginSchema), login)
router.post('/forgot-password', limiter, validate(forgotPasswordSchema), forgotPasswordEmailVerification)
router.patch('/reset-password', limiter, validate(resetPasswordSchema), verifyOtpAndUpdatePassword)
router.get('/logout',logout)
router.patch('/update-profile', protectRoute, uploadImage, updateProfile)

router.get('/check',protectRoute,checkAuth)
export default router