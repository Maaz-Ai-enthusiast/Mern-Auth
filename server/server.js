import express from 'express';

import cors from 'cors';

 import dotenv from "dotenv";

 import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';


dotenv.config();
 const app = express();

 const PORT=process.env.PORT || 5000;

 connectDB();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    
    // API endpoints

  app.use("/api/auth",authRouter)
  app.use("/api/user",userRouter)

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });