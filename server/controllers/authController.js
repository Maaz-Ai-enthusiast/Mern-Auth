import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import transporter from "../config/nodeMailer.js";
import dotenv from "dotenv";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

dotenv.config();


export const register = async (req, res) => {


    const {name,email,password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({error: "All fields are required"})
    }
  

    try {

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({error: "User already exists"})
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({name, email, password : hashPassword});
        await user.save();
       
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        
 res.cookie(
    "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
 );



 // sending welcome email

 const  mailOptions={

 from : process.env.SENDER_EMAIL,
 to : email,
 subject : "Welcome to our platform",
 text : "Thank you for joining our platform. You can now start using our services."

 }

    await transporter.sendMail(mailOptions);


 return res.json({

        success: true,
        message: "User created successfully",
        token: token
        
 })

    } catch (error) {
        res.status(500).json({
            error: "Server error",
            success: false,
            message: error.message || error
        })
    }
    

} 

export const login=async(req,res)=>{

const {email,password} = req.body;

if(!email || !password){

 return res.status(400).json({
    error: "All fields are required",
    success: true,
    error :true,

 })

}

try {


const user=await userModel.findOne({email});

if(!user){
    return res.status(404).json({
        error: "User not found",
        success: true,
        error :true,
    })
}

const isPasswordMatch= await bcrypt.compare(password, user.password);

if(!isPasswordMatch){
    return res.status(400).json({
        error: "Invalid password",
        success: true,
        error :true,
    })

}

const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

res.cookie(
    'token', token,
    {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" :'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
})

return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: token
})



    
} catch (error) {
    
return res.status(400).json({
    error: "Server error",
    success: false,
    message: error.message || error
})

}


}


export const logout=async(req,res)=>{

try {

res.clearCookie('token',{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" :'strict',
});

return res.status(200).json({
    success: true,
    message: "User logged out successfully"
})
    
} catch (error) {
    
res.json({
    success: false,
    message: "Server error",
    error: error.message || error
})

}

}


export const sendVerifyOtp= async (req, res)=>{


 try {

    const {userId}=req.body

    const user=await userModel.findById(userId);

    if(user.isAccountVerified){
        return res.status(400).json({
            success: false,
            message: "Account is already verified"
        })
    }
    
    const otp=String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp=otp;

    user.verifyOtpExpireAt=Date.now() + 24 * 60 * 60* 1000;

    await user.save();

const mailOptions={

    from : process.env.SENDER_EMAIL,
    to : user.email,
    subject : "Account verification OTP",
    // text : ` Your account verification OTP is ${otp}`,
    html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

}

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    })

    
 } catch (error) {
    
 res.json({
    success: false,
    message: "Server error",
    error: error.message || error
 })

 }

}


export const verifyEmail= async (req, res)=>{

    
    const {userId, otp}=req.body;

    if(!userId || !otp){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        }) 
    } 

    try {

      const user=await userModel.findById(userId)
      if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
      }

        if(user.verifyOtp===''|| user.verifyOtp!==otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
 if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            })
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Account verified successfully"
        })


    } catch (error) {
        res.json({
            success: false,
            message: "Server error",
            error: error.message || error
        })
    }

}

export const isAuthenticated = (req, res) =>{
    try {

        res.json({
            success: true,
            message: "User authenticated"
        })
        
    } catch (error) {
        res.json({
            success: false,
            message: "Server error",
            error: error.message || error
        })
    }
}

// send password reset otp

export const sendPasswordResetOtp= async (req, res)=>{

const {email}=req.body;

if(!email){
    return res.status(400).json({
        success: false,
        message: "Email is required"
    })
}

try {

    const user=await userModel.findOne({email});
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    
    const otp=String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp=otp;
    user.resetOtpExpireAt=Date.now() +  15 * 60 * 1000;
    await user.save();

    const mailOptions={

        from : process.env.SENDER_EMAIL,
        to : user.email,
        subject : "Password reset OTP",
        // text : ` Your password reset OTP is ${otp}`,
        html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
        success: true,
        message: "Password reset OTP sent successfully"
    })
    
} catch (error) {
    
res.json({
    success: false,
    message: "Server error",
    error: error.message || error
})


}

}

// verify user password reset otp


export const verifyPasswordResetOtp= async (req, res)=>{

const {email, otp,newPassword}=req.body;

if(!email || !otp || !newPassword){
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    })
}

try {

    const user=await userModel.findOne({email});

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if(user.resetOtp===''|| user.resetOtp!==otp){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        })
    }

    if(user.resetOtpExpireAt < Date.now()){
        return res.status(400).json({
            success: false,
            message: "OTP expired"
        })
    }
    
const hashPassword = await bcrypt.hash(newPassword, 10);
user.password=hashPassword;
user.resetOtp='';
user.resetOtpExpireAt=0;

await user.save();

return res.status(200).json({
    success: true,
    message: "Password reset successfully"
})


} catch (error) {
    
res.json({
    success: false,
    message: "Server error",
    error: error.message || error
})

}

} 