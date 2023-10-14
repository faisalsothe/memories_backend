import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors";
import events from "events"
import dotenv from "dotenv"
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

events.EventEmitter.prototype._maxListeners = 100;
dotenv.config();

const app=express();
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use(express.json());

//indicates all routes in postRoutes will start from /posts
app.use("/posts",postRoutes);
app.use("/users",userRoutes);



const CONNECTION_URL=process.env.CONNECTION_URL;
const PORT=process.env.PORT;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`Server Running on Port: ${PORT}`)))
.catch((err)=>console.log(err));



