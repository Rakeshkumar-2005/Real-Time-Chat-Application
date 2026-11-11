import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./routes/authUser.js"

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

dotenv.config();// it means it can be access from any whare 

app.use(express.json());

app.use('/api/auth',authRouter);


app.get('/',(req,res)=>{
  res.send("server is working");
});

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
  dbConnect();
  console.log(`working at ${PORT}`);
});
