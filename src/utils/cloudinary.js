import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


const uploadFileOnCloudinary = async (pathToLocalFile, retries = 3) => {

    let attempt= 0;

    while(attempt < retries){
        try{

            if(!pathToLocalFile) return null;

            const response = await cloudinary.uploader.upload(pathToLocalFile, {
                resource_type: "auto"
            });

            console.log("File upload success:", response);
            fs.unlinkSync(pathToLocalFile);
            return response;

        }
        catch(error){

            attempt += 1;
            console.error(`File upload attempt:${attempt} failed!!`, error);

            if(attempt >= retries){
                console.log("Max retries limit reached!!");
                throw new ApiError(500, `Upload failed after multiple attempts!! with error ${error.message}`);
            }
            
            //delay
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay

        }
    }

}

export default uploadFileOnCloudinary;