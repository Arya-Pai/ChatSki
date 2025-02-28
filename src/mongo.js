import mongoose from "mongoose";
import Joi from "joi";
mongoose.connect("mongodb://localhost:27017/chatApplication")
.then(()=>{
    console.log('MongoDB connected');
});
const signUpSchema=new mongoose.Schema({
  
    username:{
        type:String,
        required:true,
        minlength:3,
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
        maxlenght:20
    },
});

const signup=mongoose.model('signup',signUpSchema);
function validateUser(data){
    const signupValidate=Joi.object({
        username: Joi.string().min(3).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).required(),
        passwordConfirm: Joi.string().valid(Joi.ref('password')).required()

    });
    return signupValidate.validate(data);
}

export { signup as signup, validateUser as validate };
