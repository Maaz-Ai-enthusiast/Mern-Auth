import express from 'express';

import cors from 'cors';

 import dotenv from "dotenv";

 import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';

import path from "path";

dotenv.config();
 const app = express();

 const PORT=process.env.PORT || 5000;
// const allowOrigin = ["http://localhost:5173"];
 connectDB();

    app.use(express.json());
    app.use(cors({
        origin:'https://mern-auth-production-01f1.up.railway.app/',
        credentials:true
    }));
    app.use(cookieParser());
    
    // API endpoints

  app.use("/api/auth",authRouter)
  app.use("/api/user",userRouter)

  const __dirname = path.resolve()


  app.use(express.static(path.join(__dirname,"/client/dist")))
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
  })
    app.listen(PORT, () => {
        
        console.log(`Server running on port ${PORT}`);
    });