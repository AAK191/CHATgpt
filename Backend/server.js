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
app.use(cors({
  origin: [
    `https://frontend_gpt.vercel.app`,
    'http://localhost:5173' 
  ]
}));

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


app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});