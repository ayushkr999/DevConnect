import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/db.js";
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config()

const app=express();
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

dbConnect()

const PORT=process.env.PORT || 5000;

app.use("/api/v1",userRoutes)

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`)
})


