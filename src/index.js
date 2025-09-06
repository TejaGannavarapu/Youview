import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

dotenv.config({ path: './env' });

// import mongoose from "mongoose";
// import {DB_NAME} from "./contants";


connectDB()
.then(() => {

    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening to port: ${process.env.PORT}`);
    });

})
.catch((err) => {

    console.error(`Error while listening to port: ${process.env.PORT}`, err);
    throw err;

});


/*
IIFE
(async () => {
    try{

        const dbConn =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);


    } catch(err){

        console.error("Database connection denied", err);
        throw err;

    }
    
})(); 
*/