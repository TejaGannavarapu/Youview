import asyncHandler from "../utils/asyncHandler.js";
import validateFields from "../utils/validation.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadFileOnCloudinary from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const options = {
        httpOnly: true,
        secure: true
    }

//Helper method to generates access and refresh tokens
const generateAccessAndRefreshTokens = async ( user ) => {

    try{
        console.log("In generateAccessAndRefreshTokens");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        console.log(user, accessToken, refreshToken);

        return {accessToken, refreshToken};

    }catch(err){

        console.log(` line 25: ${err}`);
        throw new ApiError(500, "Something went wrong while generating referesh and access token");

    }
    
}


const registerUser = asyncHandler( async (req, res) => {

    console.log(req.body);
    // 1. Collect user details from frontend
    const { username, password, email, fullname } = req.body;
    console.log(password);

    // 2. Validation for empty/null checks
    validateFields( username, password, email, fullname );

    // 3. Verify if user already present
    const ifUserExists =  await User.findOne({

        $or: [{ username: username },{ email: email }]
        
    });
    console.log(ifUserExists);
    if(ifUserExists){
        throw new ApiError(409, "User already exists!");
    }

    // 4. Verify and Upload coverimage & avatar to cloudinary
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log(avatarLocalPath, coverImageLocalPath);

    //4.1 Verify
    if(avatarLocalPath == null){
        throw new ApiError(400, "Avatar image must be uploaded");
    }

    // 4.2 Upload to Cloudinary
    const avatar = await uploadFileOnCloudinary(avatarLocalPath);
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

    // 5. Parse the response and verify upload is successful
    console.log(avatar.url, coverImage.url);

    // 6. Create user object and save to db
    const user = await User.create({
        username: username.toLowerCase(), 
        password, 
        email, 
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // 7. Verify user creation and remove sensitive fields from the response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 8. Return the response
    res.status(201).json( new ApiResponse(201, createdUser, "User registered successfully!"));

});

const loginUser = asyncHandler( async (req, res) => {

    // 1. Read the username/email and password from req.body
    const {username, email, password} = req.body;
    
    if(!username && !email){
        throw new ApiError(400, "Username or email cannot be empty");
    }


    // 2. Validate the data against the database
        // 2.1 Call to DB query against username
        const user = await User.findOne({
            $or: [{username: username}, {email: email}]
        });

        if(!user){
            throw new ApiError(404, "User does not exist");
        }

        // 2.2 Authenticate user with password against the provided
        const authNPassword = await user.verifyPassword(password);
        console.log(user.password, await bcrypt.hash(password, 10), authNPassword);

        if(!authNPassword){
            throw new ApiError(401, "Invalid user credentials");
        }
    
    console.log("Password verified");
    // 3. Generate access & refresh token if valid user
    const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    // 4. Send both of them in cookies
    // 5. Send response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    );

});

const logoutUser = asyncHandler( async (req,res) => {

    // 1. authenticate user with cookies - taken care by verifyJWT middleware
    
    // 2. Call db with userId and set the refresh token to undefined
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    );

    // 3. send the response

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out!"
        )
    );


});

const refreshAccessToken = asyncHandler( async (req, res) => {

    // 1. get the refreshToken from the client
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    // 2. Validate the token
    if(!incomingToken){

        throw new ApiError(401, "Unauthorized request");

    }
    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!user){

        throw new ApiError(401, "Invalid refresh token");

    }

    if (incomingToken !== user?.refreshToken) {
    
        throw new ApiError(401, "Refresh token is expired or used, Please login again!")
    
    }

    // 3. If Valid, generate a new tokens and send to the client
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user);

    // 4. send response
    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            { accessToken, refreshToken },
            "New accessToken generated"
        )
    );

});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
