import ApiError from "./ApiError.js";



const validateFields = ( username, password, email, fullname ) => {

    if( username == null || username.trim() == "" ){

        throw new ApiError(404, "username cannot be empty");

    }
    if( password == null || password.trim() == "" ){

        throw new ApiError(404, "password cannot be empty");

    }
    if( email == null || email.trim() == "" ){

        throw new ApiError(404, "email cannot be empty");

    }
    if( fullname == null || fullname.trim() == "" ){

        throw new ApiError(404, "fullname cannot be empty");

    }

}

export default validateFields;