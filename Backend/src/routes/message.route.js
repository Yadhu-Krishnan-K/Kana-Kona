import {Router} from 'express'
import {getMessages,getUsersSidbar,sendMessage} from '../controllers/message.controll.js'
import protectRoute from '../middlewares/auth.middleware.js'
const router = Router()


router.get("/users",protectRoute,getUsersSidbar)
router.get("/:id",protectRoute,getMessages)
router.post('/send/:id',protectRoute,sendMessage)


export default router