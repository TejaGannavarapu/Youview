import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({ path: './env' });

// import mongoose from "mongoose";
// import {DB_NAME} from "./contants";


connectDB();


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