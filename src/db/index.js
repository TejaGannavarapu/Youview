import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// returns a promise
const connectDB = async () => {

    try{

        const dbConn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB connected! , DB HOST: ${dbConn.connection.host}`);
        console.log(dbConn);

    }
    catch(err){

        console.error("MongoDB connection denied", err);
        process.exit(1);

    }

}

export default connectDB;



/*import { MongoClient, ServerApiVersion } from "mongodb";
const uri = "mongodb+srv://gannavaraputeja2000:teja123@youlive.emq5qpp.mongodb.net/?retryWrites=true&w=majority&appName=YouLive";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const conn = await client.connect();
    console.log(conn);
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


export default run;*/