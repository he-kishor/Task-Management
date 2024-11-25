require('dotenv').config();
const User = require('../../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const loginuser =async({email,pass})=>{
    const user = await User.findOne({email});
     if(!user){
         throw ({status:400, message:"Invalid EmailID"});
 
     }
     //user hashed password
     const ispasswordValid= await bcrypt.compare(pass,user.pass);
     if (!ispasswordValid){
         throw({status:400,message:"Invalid User"})
     }
 
     const token= jwt.sign({id:user._id,email:user.email}, process.env.jwtsecrettoken,{expiresIn:'4h'});
     
    
 
     const currentdate=new Date();
     const user_up =await User.findByIdAndUpdate(
         user.id,
 
         {
             $set:{
                 lastLoginAt:currentdate,
                 
             }
         },
             {new:true}
 
         );
     return {
         //response the json object to make all kind api helpful
         message:"Login Successfully",
         token,
         
         user:{
             u_id:user_up ._id,
             email:user_up .email,
             fname:user_up .fname,
             lname:user_up .lname,
             lastLoginAt:user_up.lastLoginAt
             
         }
     };
    };
 
    module.exports = loginuser;