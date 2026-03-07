import {Router} from 'express'
import {getMessages,getUsersSidbar,sendMessage} from '../controllers/message.controll.js'
import protectRoute from '../middlewares/auth.middleware.js'
import { uploadImage } from '../middlewares/upload.js'
const router = Router()


router.get("/users",protectRoute,getUsersSidbar)
router.get("/:id",protectRoute,getMessages)
router.post('/send/:id', protectRoute, uploadImage, sendMessage)


export default router