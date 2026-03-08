import express from 'express'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'


import connectDB from './lib/db.js'

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { app, server } from "./lib/socket.io.js";

config()

const port = process.env.PORT || 8000
const _dirname = path.resolve();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials:true
}))
 
//@main routes
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


server.listen(port,()=>{
    console.log('server starting...')
    connectDB()
})