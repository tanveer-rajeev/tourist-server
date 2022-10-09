    import express from "express";  
    import {commentPosts,getPost, getPosts,getPostsBySearch, createPosts, updatePosts, deletePosts, likePost } from "../controllers/postController.js";
    import auth from "../middleware/auth.js";

    const postRouter = express.Router();

    postRouter.get("/", getPosts); 
    postRouter.get("/search",getPostsBySearch);
    postRouter.get("/:id", getPost);

    postRouter.post("/",auth, createPosts);
    postRouter.patch("/:id",auth, updatePosts);
    postRouter.delete("/:id",auth, deletePosts);
    postRouter.patch("/:id/likePost",auth, likePost);
    postRouter.patch("/:id/commentPost",auth,commentPosts)
    


    export default postRouter;
