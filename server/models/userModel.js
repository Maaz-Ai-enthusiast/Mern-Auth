import mongoose from "mongoose";

const userSchema = mongoose.Schema({

name :{
    type: String,
    required: true
},

email :{
    type: String,
    required: true,
    unique: true
},

password :{
    type: String,
    required: true
},
verifyOtp :{
    type: String,
    default: null
},
verifyOtpExpireAt :{
    type: Number,
    default: 0
},
isAccountVerified :{
    type: Boolean,
    default: false
},
resetOtp :{
    type: String,
    default: ""
},
resetOtpExpireAt :{
    type: Number,
    default: 0
}, 

},{
    timestamps: true
})

const userModel = mongoose.model('user', userSchema)

export default userModel;