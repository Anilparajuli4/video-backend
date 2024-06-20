import express from 'express'
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js'
import { upload } from '../middleware/multer.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = express.Router()



router.post('/register', upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
    {
        name:'coverImage',
        maxCount:1
    }
]),  registerUser)

router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.post('/refreshToken',  refreshAccessToken)

export default router 