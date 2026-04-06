import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'

const app = express();
const PORT = process.env.PORT;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
//DB

//ROUTES
app.get("/",(req,res)=>{
 res.send("API WORKING");
});

app.listen(PORT,()=>{
    console.log(`Server Started on http://localhost:${PORT}`)
})
