import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user-routes.js";
import audioRoutes from "./routes/audioRoute.js";
import imgRoutes from "./routes/imgRoute.js";
import historyRoutes from "./routes/historyRoute.js"
import paymentRoutes from "./routes/paymentRoute.js"
import textTranslateRoutes from"./routes/textTranslate.routes.js"
import tripRoutes from "./routes/tripRoutes.js"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//for cross origin
const app = express();
app.use(
    cors(
        {
            origin: process.env.CORS_ORIGIN ||'*',
            credentials: true
        }
    )
)

//common middleware for acceptiong json formate file
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// app.use(express.static("public"))

// for parsing  cookies 
app.use(cookieParser());

app.use("/api/auth", userRoutes)

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);
app.use("/api/audio", audioRoutes);
app.use("/api/img", imgRoutes);
app.use("/api/text", textTranslateRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip", tripRoutes);
export { app }