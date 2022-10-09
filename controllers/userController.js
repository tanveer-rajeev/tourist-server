import UserSchema from "../models/UserSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const test = async (req, res) => {
    console.log("test");
}
export const getUser = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.send(404).send("User not found");
    
    try {
        const user = await UserSchema.findById(id);
        res.json(user);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
    
}

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existentUser = await UserSchema.findOne({email});

        if(!existentUser) return res.status(404).json({message:"User not exist"});
        
        const isValidPassword = await bcrypt.compare(password, existentUser.password);
        
        if(!isValidPassword) return res.status(404).json({message: "Password not valid"});

        const token = jwt.sign({email: existentUser.email,id: existentUser._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "1h"});
        res.status(200).json({result: existentUser, token:token});

    } catch (error) {
        res.status(500).json({ message: "Fail to signin" })
    }
    
}
export const signup = async (req, res) => {
    const {email,password,confirmPassword,firstName,lastName} = req.body;
    
    try {
        const existentUser = await UserSchema.findOne({email});

        if(existentUser)
               return res.status(404).json({message: "User already exist"});
              
        if(password !== confirmPassword) 
               return res.status(404).json({message: "Password won't match with confirm password"});
              
        const hashPassword = await bcrypt.hash(password, 12);
       
        const result = await UserSchema.create({email, password: hashPassword, name: `${firstName} ${lastName}`})
        console.log(result);
        const token = jwt.sign({email: email, id: result._id}, process.env.ACCESS_TOKEN_SECRET,  {expiresIn: "1h"});
     
        res.status(200).json({result: result, token:token});
    } catch (error) {
        res.status(500).json({ message: "Fail to signup" })
    }
    
}
export const deleteUser = async (req, res) => {
    console.log("deleted user are not there");
}
export const updateUser = async (req, res) => {
    console.log("updated");
}