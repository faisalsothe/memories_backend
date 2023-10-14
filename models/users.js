import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,default:""},
    email:{type:String,required:true,default:""},
    password:String,
    profilePicture:{type:String,default:""},
    id:{type:String}
})

const User=mongoose.model("user",userSchema);

export default User;