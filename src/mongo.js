import mongoose from "mongoose";
import Joi from "joi";
mongoose.connect("mongodb://localhost:27017/chatApplication");
.then(()=>{
    console.log('MongoDB connected');
});
const signUpSchema=new mongoose.Schema({
  
    username:{
        type:String,
        required:true,
        minlength:7,
        maxlength:15,
    },
    email:{
        type:String,
        required:true,
        minlength:7,
        maxlength:15,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlenght:15
    },
});

const signup=mongoose.model('signup',signUpSchema);
function validate(data){
    const signupValidate=Joi.object({
        username:Joi.string().min(3).max(15).required(),
        email:Joi.string().min(3).max(15).required(),
        password:Joi.string().min(3).max(15).required()

    });
    return signupValidate.validate(data);
}

exports.signup=signup;
exports.validate=validate;
