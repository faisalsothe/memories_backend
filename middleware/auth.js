import jwt from 'jsonwebtoken'
import config from "config"

//wants to like a post
//clikc the link button => auth middleware (next) => like controller

//MIDDLEWARE MADE FOR USER VERIFICATION
const auth=async (req,res,next)=>{
    try{
        //GET TOKEN
        const token=req.headers.authorization.split(" ")[1];
        //CHECK FOR OUR TOKEN
        const isCustomAuth=token.length<500;

        let decodedData;
        //IF TOKEN FROM DB LOGIN
        if(token && isCustomAuth){
            decodedData=jwt.verify(token,config.get("JWT_SECRET"));
            req.userId=decodedData?.id;
        }
        //TOKEN FROM GOOGLE OAUTH
        else{
            decodedData=jwt.decode(token);
            req.userId=decodedData?.sub;
        }
        next();
    }catch(error){
        console.log(error);
    }
}

export default auth;