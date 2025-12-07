import express from "express"
import cors from 'cors'
import connectDB from "./configs/db.js"
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express()

dotenv.config();

await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/',(req,resp)=>{
  resp.send("api is working")
})

app.use('/api/admin',adminRouter)

app.use('/api/blog',blogRouter)


const PORT = process.env.PORT || 3500

app.listen(PORT,()=>{
    console.log("server is runing on"+ PORT)
})