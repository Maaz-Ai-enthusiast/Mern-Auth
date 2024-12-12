import { Router } from "express";
import userAuth from "../middlewares/userAuthMiddleware.js";
import { getUserData } from "../controllers/userController.js";


const userRouter=Router();


userRouter.get("/data",userAuth,getUserData)


export default userRouter;
