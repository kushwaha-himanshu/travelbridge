import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import testRoutes from "./routes/test.routes.js"
import userRoutes from "./routes/user-routes.js";
import audioRoutes from "./routes/audioRoute.js";
import imgRoutes from "./routes/imgRoute.js";
import historyRoutes from "./routes/historyRoute.js"
//for cross origin
const app=express();
app.use(
    cors(
        {
            origin:process.env.CORS_ORIGIN||"*" ,
            credentials:true
        }
    )
)

//common middleware for acceptiong json formate file
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
 app.use(express.static("public"))
// for parsing  cookies 
 app.use(cookieParser())
app.use("/api/v1/test", testRoutes)
app.use("/api/auth",userRoutes)

app.use("/api/audio",audioRoutes);
app.use("/api/img",imgRoutes);
app.use("/api/history",historyRoutes);

export {app}