import User from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'


const generateAccessToken = async(userId)=>{
   try {
      const user = await User.findById(userId)
      if(!user){
         throw new ApiError(400, 'user not found ')
      }
      const accessToken =user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
     user.refreshToken = refreshToken
     await user.save({validateBeforeSave:false})
     return {accessToken, refreshToken}
   } catch (error) {
      throw new ApiError(500, "something went wrong while generating refresh and access token")
   }
}

export const registerUser = asyncHandler(async(req, res, next)=>{
   const{fullname, username, email, password}= req.body
   if([fullname, username, email, password].some((field)=>field?.trim()=== '')){
    throw new ApiError(400, 'All fields are required')
   }

   const existedUser = await User.findOne({
    $or: [{username}, {email}]
   })

   if(existedUser){
    throw new ApiError(409, 'User with email or usernmae already exsit')
   }
   const avatarLocalPath = req.files?.avatar[0]?.path
   console.log(avatarLocalPath);
   const coverImageLocalePath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new ApiError(400, 'avatar file is required in localpath')
   }

   const avatarImage = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalePath)

   if(!avatarImage){
    throw new ApiError(400, 'avatar file is required')
   }

  const userdata = await User.create({
    fullname,
    avatar:avatarImage.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username?.toLowerCase()

   })
   const createdUser = await User.findById(userdata._id).select("-password -refreshToken") 
   if(!createdUser){
    throw new ApiError(500, 'something wrong while registring the user')
   }
   return res.status(201).json(new ApiResponse(201, createdUser, "user register created successfully"))
})

export const loginUser = asyncHandler(async (req, res, next)=> {
   const {email, username, password} = req.body
   if(!username && !email){
      throw new ApiError(400, 'username or email is required')
   }

  const user= await User.findOne({
      $or: [{username}, {email}]
   })
   if(!user){
      throw new ApiError(400, 'user doesnot exist')
   }
   const isPasswordValiad = await user.isPasswordCorrect(password)
   if(!isPasswordValiad){
      throw new ApiError(400, 'invaliad users credentaials')
   }
  const {accessToken, refreshToken}= await generateAccessToken(user._id)
const loggedUser = await User.findById(user._id).select(" -refreshToken  -password")
const options = {
   httpOnly:true,
   secure:true
}
return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {user:loggedUser, accessToken, refreshToken}, 'User logged in successfully'))
}) 

export const logoutUser=async(req, res, next)=>{
   await User.findByIdAndUpdate(req.user._id, {
      $set:{refreshToken:undefined}
   },
   {
      new:true
   }
)
const options = {
   httpOnly:true,
   secure:true
}
return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "user logged out"))
}


export const refreshAccessToken = asyncHandler(async(req, res, next)=>{
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
   throw new ApiError(401, 'unathorized request')
  }

  try {

   const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  const user= await User.findById(decoded?._id)
  if(!user){
   throw new ApiError(401, 'invaliad refresh token')
  }

  if(incomingRefreshToken !==  user?.refreshToken){
   throw new ApiError(401, "Refresh token is expired or used")
  }

  const options = {
   httpOnly:true,
   secure:true
  }

  const {accessToken, newRefreshToken} = await generateAccessToken(user._id)
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(200, {
   accessToken, refreshToken:newRefreshToken
  }, "Access token refresh successfully")
   
  } catch (error) {
   throw new ApiError(401, error?.message || "Invalid refresh token")
  }

  
})