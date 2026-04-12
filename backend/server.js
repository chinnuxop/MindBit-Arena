import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
//DB
connectDB();

//ROUTES
app.get("/",(req,res)=>{
 res.send("API WORKING");
});

app.listen(PORT,()=>{
    console.log(`Server Started on http://localhost:${PORT}`)
})
