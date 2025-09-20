import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({
    limit : "19kb"
}));
app.use(express.urlencoded(
    { 
        limit : "50kb",
        extended : true
    }
));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import router  from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", router);



export default app;