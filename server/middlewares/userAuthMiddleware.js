import jwt from "jsonwebtoken";

const userAuth=async (req, res, next)=>{


    const {token} = req.cookies;

    if(!token){
        res.json({
            success: false,
            message: "User not authenticated"
        })
    }

    try {

       const tokenDecode= jwt.verify(token, process.env.JWT_SECRET);

       if(tokenDecode.id){
        req.body.userId= tokenDecode.id;
       }
       else {
        res.json({
            success: false,
            message: "User not authenticated login again"
        })
       }
        next();

    } catch (error) {
        res.json({
            success: false,
            message: "User not authenticated",
            error : error.message || error

        })
    }


}

export default userAuth;