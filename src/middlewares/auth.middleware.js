import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";



const verifyJWT = asyncHandler( async (req, res, next) => {

    // 1. get the cookies from the req
    const accessToken= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // 2. validate if present
    if(!accessToken){
        throw new ApiError(401, "Unauthorized request - Access token missing!");
    }

    // 3. Verify if valid jwt
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    
    // 4. get user from db
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401, "Invalid Access Token!");
    }

    // 5. set user to req
    req.user = user;

    next();

});

export default verifyJWT;