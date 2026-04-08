import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect("mongodb+srv://dibeshkumarparida2610_db_user:Dibesh2003@cluster0.s0jvco1.mongodb.net/MindBit_Arena")
    .then(() =>{
console.log("DB CONNECTED..")
    })
}