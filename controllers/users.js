import mongoose from "mongoose";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import axios from "axios"
import config from "config"
import User from "../models/users.js"


const signInUser=async(req,res)=>{
    if(req.body.googleAccessToken){
        //google log-in
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers:{
                "Authorization":`Bearer ${req.body.googleAccessToken}`
            }
        }).then(async response=>{
            const email=response.data.email;
            const alreadyExistingUser=await User.findOne({email});
            if(!alreadyExistingUser){
                return res.status(400).json({message:"User Doesn't Exists!!"});
            }
            const token=jwt.sign({
                email:alreadyExistingUser.email,
                id:alreadyExistingUser._id,
            },config.get("JWT_SECRET"),{expiresIn:"1d"});
            res.status(200).json({result:alreadyExistingUser,token})
        }).catch((err)=>{console.log(err)});
    }
    ///email-password sign-in
    else{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Invalid Fields!!"});
        }
        
        try{
        const alreadyExistingUser=await User.findOne({email:email});
        if(!alreadyExistingUser){
            return res.status(400).json({message:"User Doesn't Exists!!"});
        }

        const isPasswordCorrect=await bcrypt.compare(password,alreadyExistingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Password!!"})
        }

        const token=jwt.sign({
        email:alreadyExistingUser.email,
        id:alreadyExistingUser._id
        },config.get("JWT_SECRET"),{expiresIn:"1d"});
        res.status(200).json({result:alreadyExistingUser,token});
        }catch(error)
        {
            console.log(error);
        }
    }
}

const signUpUser=async(req,res)=>{
    if(req.body.googleAccessToken){
        //google oauth Sign Up
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers:{
                "Authorization":`Bearer ${req.body.googleAccessToken}`
            }
        }).then(async response=>{
            const firstName=response.data.given_name;
            const lastName=response.data.family_name;
            const email=response.data.email;
            const profilePicture=response.data.picture;
        
        const alreadyExistingUser=await User.findOne({email});

        if(alreadyExistingUser){
            return res.status(400).json({message:"User Exists!!"})
        }
        const result=await User.create({name:`${firstName} ${lastName}`,email,profilePicture});
        const token=jwt.sign({
            email:result.email,
            id:result._id
        },config.get("JWT_SECRET"),{expiresIn:"1d"});
        res.status(200).json({result,token});
        console.log("SUCCESS!!")

    }).catch((err)=>{
        res.status(400).json({message:"Invalid Info!!"});
        console.log(err);
    });
}
    //normal Sign Up
    else{
        const {email,firstName,lastName,confirmPassword,password,picture}=req.body;
        try{
            const alreadyExistingUser=await User.findOne({email});
            if(alreadyExistingUser){
                return res.status(400).json({message:"User Exists!!"})
            }

            if(password !== confirmPassword){
                return res.status(400).json({message:"Passwords don't match"})
            }
            const hashPassword=await bcrypt.hash(password,12);

            const result=await User.create({name:`${firstName} ${lastName}`,email,password:hashPassword,profilePicture:picture});
            const token=jwt.sign({
                email:result.email,
                id:result._id
            },config.get("JWT_SECRET"),{expiresIn:"1d"});
            res.status(200).json({result,token});
        }catch(error){
            console.log(error);
        }
    }
}

export {signInUser,signUpUser};