import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


const uploadFileOnCloudinary = async (pathToLocalFile) => {

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

        console.log("File upload failed!!", error);
        throw error;

    }

}

export default uploadFileOnCloudinary;