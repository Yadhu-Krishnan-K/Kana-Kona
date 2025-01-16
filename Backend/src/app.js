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
    origin:"http://localhost:5173",
    credentials:true
}))
 
//@main routes
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname,"../Frontend/dist")))
    
    app.get("*",(req,res)=>{
        res.sendFile(path.join(_dirname,"../Frontend","dist","index.html"))
    })
}

server.listen(port,()=>{
    connectDB()
})