
/*
Wrapper for all async calls/tasks for a centralized way of handling promises/try-catch responses/errors.
1.You don’t repeat try/catch in every route.
2.Routes stay short and clean.
3.Error handling is consistent everywhere.
*/

//HO function
const asyncHandler = (requestHandler) => {

    async (req, res, next) => {

        try{

            await requestHandler(req, res, next);

        }
        catch(error){

            res.status(error.code || 500).json({
                success: false,
                message: error.message
            });

        }

    }


}


//The promise way
/*
const asyncPromiseHandler = (requestHandler) => {

    async (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch( error => next(error));
    }

}
*/

export default asyncHandler;