import express from 'express'
import { changeCurrentPassword, getUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetail, updateUserAvatar, userCoverImage } from '../controller/user.controller.js'
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
router.post('/changepassword', verifyJWT,  changeCurrentPassword)
router.get('/currentuser', verifyJWT, getUser)
router.patch('update-account', verifyJWT, updateAccountDetail)
router.patch('/avatar', verifyJWT, upload.single('avatar'), updateUserAvatar)
router.patch('/coverImage', verifyJWT, upload.single('coverImage'), userCoverImage)
router.get('/channel/:username', verifyJWT, getUserChannelProfile)
router.get('/history', verifyJWT, getWatchHistory)

export default router 