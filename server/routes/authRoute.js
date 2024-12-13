import { Router } from "express";
import { isAuthenticated, login, logout, register, sendPasswordResetOtp, sendVerifyOtp, verifyEmail, verifyPasswordResetOtp } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuthMiddleware.js";


const authRouter=Router();

authRouter.post('/register',register)  
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp);
authRouter.post("/verify-email",userAuth,verifyEmail)
authRouter.get("/is-auth",userAuth,isAuthenticated)
authRouter.post("/send-reset-otp",sendPasswordResetOtp)
authRouter.post("/reset-password",verifyPasswordResetOtp)

export default authRouter;