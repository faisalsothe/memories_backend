import mongoose from "mongoose"

const postsSchema=new mongoose.Schema({
    title:String,
    message:String,
    name:String,
    creator:String,
    tags:[String],
    selectedFile:String,
    likes:{type:[String],default:[]},
    comments:{type:[String],default:[]},
    createdAt:{type:Date,default:new Date()}
});

const postsMessage=mongoose.model("post",postsSchema)

export default postsMessage;