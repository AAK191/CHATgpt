import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
console.log("ENV KEYS:", Object.keys(process.env));
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());


app.use("/api",chatRoutes);

const connectDB = async() => {
    try{
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected with database");
    }catch(err){
        console.log(err);
    }
}


/**app.post("/test", async (req, res) => {

    
});**/


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});