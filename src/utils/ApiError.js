

class ApiError extends Error{

    constructor( 
        statusCode, 
        message = "Something went wrong!", 
        cause,
        errors = [],
        stack = ""
    ){

        super();
        this.statusCode = statusCode;
        this.message = message;
        this.cause = cause;
        this.errors = errors;
        this.data = null;
        this.success = false;
        
        if (stack) {
            this.stack = stack;
        } else{
            Error.captureStackTrace(this, this.constructor);
        }

    }

}

export default ApiError;