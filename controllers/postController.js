  import mongoose from "mongoose";
  import PostSchema from "../models/PostSchema.js";

  export const getPost = async (req, res) => {
    const {id} = req.params;
   
    try {  
        const post = await PostSchema.findById(id);
        res.send({data: post});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  };

  export const getPosts = async (req, res) => {
    const {page} = req.query;
   
    const pageNumber = ( page === 'undefined') ? 0 : Number(page);

    try {
        const total = await PostSchema.countDocuments({});
        const LIMIT = pageNumber === 0 ? total : 4;
        const startIndex = pageNumber === 0 ? 0 :(pageNumber - 1) * LIMIT;
        
        const posts = await PostSchema.find().sort({ _id: 1}).limit(LIMIT).skip(startIndex);
        
        res.send({data: posts, currentPage:Number(pageNumber), numberOfPages:Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  };

  export const getPostsBySearch = async (req, res) => {
    const {searchQuery,tags} = req.query;

    try {
        const title = new RegExp(searchQuery,'i');
        
        const posts = await PostSchema.find({ $or: [ { title } , { tags : { $in : tags.split(',') } } ] });
  
        res.send({data: posts});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    
  };

  export const createPosts = async (req, res) => {
    const post = req.body;

    if(!req.userId) return res.status(403).json({ message: "Unauthenticated user"});

    const newPost = new PostSchema({...post, creator: req.userId , createdAt: new Date().toISOString() });
 
    try {
        await newPost.save();
        res.send(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
  };

  export const updatePosts = async (req, res) => { 
    const { id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.send(404).send("The given id is not valid");

    try {
        const updatePosts = await PostSchema.findByIdAndUpdate(id,{...post, _id: id},{ new : true});
        res.send(updatePosts);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    
  }
  
  export const deletePosts = async (req, res) => { 
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.send(404).send("The given id is not valid");

    try {
        await PostSchema.findByIdAndRemove(id);
        res.send(id);
    } catch (error) {
        res.json({ message: error.message });
    }
    
  }
  export const likePost = async (req, res) => { 
    const { id} = req.params;

    if(!req.userId) return res.status(403).json({ message: "Unauthenticated user"});


    if(!mongoose.Types.ObjectId.isValid(id)) return res.send(404).send("The given id is not valid");

    try {
        const post = await PostSchema.findById(id);
    
        const index = post.likes.findIndex((id) => id === req.userId);
        
        if(index == -1){
          post.likes.push(req.userId);
        }else{
          post.likes =  post.likes.filter((id)=> id !== req.userId);
        }

        const updatePost = await PostSchema.findByIdAndUpdate(id, post, { new : true });
        res.send(updatePost);
    } catch (error) {    
        res.status(409).json({ message: error.message });
    }  
  }

  export const commentPosts = async (req, res) => {
    const { id} = req.params;
    const {comment} = req.body;
     console.log(req.body);
    try {
        const post = await PostSchema.findById(id);
        post.comments.push(comment);
        
        const updatePosts = await PostSchema.findByIdAndUpdate(id, post, { new : true});
        res.send(updatePosts);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
  }