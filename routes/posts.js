import express from "express"

import {commentPost,getPosts,getPostsById,getPostsBySearch,createPosts,updatePosts,deletePosts,likePosts} from "../controllers/posts.js"
// import auth middleware
import auth from "../middleware/auth.js"

// implementing routes
const router=express.Router();

router.get("/",getPosts);
router.post("/",auth,createPosts);
router.get("/search",getPostsBySearch);
router.get("/:id",getPostsById); 
router.patch("/:id",auth, updatePosts);
router.delete("/:id",auth, deletePosts);
router.patch("/:id/likePost",auth, likePosts);
router.post("/:id/commentPost",auth, commentPost);



export default router