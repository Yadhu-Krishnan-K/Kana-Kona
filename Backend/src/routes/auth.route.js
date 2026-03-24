import express from "express";
import { login, logout, signup, verifyOtp,checkAuth,updateProfile } from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.js";

const router = express.Router()

router.post('/signup',signup)
router.post('/verifyOtp',verifyOtp)
router.post('/login',login)
router.get('/logout',logout)
router.patch('/update-profile', protectRoute, uploadImage, updateProfile)

router.get('/check',protectRoute,checkAuth)
export default router