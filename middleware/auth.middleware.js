import User from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyJWT= asyncHandler(async(req, res, next)=>{
    try {
        const token =  req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")
        if(!token){
         throw new ApiError(401, "Unathorized request")
        }
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
      const user = await User.findById(decoded?._id).select("-password -refreshToken")
      if(!user){
         throw new ApiError(401, "invaliad access token")
      }
      req.user = user
      next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invaliad access token")
    }

})