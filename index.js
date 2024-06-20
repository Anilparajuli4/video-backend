import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes.js'
const app = express()
dotenv.config()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static('public'))
app.use('/api/v1/users', userRouter)

mongoose.connect(process.env.DB).then(()=>console.log('connected to databse')).catch((err)=>console.log('error in db', err))


app.listen(process.env.PORT, ()=>{
    console.log('server has started');
})