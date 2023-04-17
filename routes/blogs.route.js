const express=require("express")
const jwt=require("jsonwebtoken");
const BlogModel = require("../models/blogs.model");
const authorize = require("../middlewares/authorize.mw");

const blogRouter = express.Router();

// post route for adding blog
blogRouter.post("/add", async (req,res)=>{
    const payload=req.body
    try {
        const new_blog=new BlogModel(req.body)
        await new_blog.save()
        res.status(200).send({"msg":"blog Created"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
 })

 // get route of that user
 blogRouter.get("/get", async(req,res)=>{
    const { pscAccessToken } = req.cookies;
    const isTokenValid = jwt.verify(
        pscAccessToken,
        "jwtsecretkeyfromenvfile"
      );
    try {
        if(isTokenValid){
            const posts= await BlogModel.find({"userID":isTokenValid.userID});
            res.status(200).send(posts)
        } else{
            res.status(400).send({msg:"No blog has been created by this user"})
        }
    
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


// update route for posts
blogRouter.patch("/update/:postID", async(req,res)=>{
    const payload=req.body
    const postID=req.params.postID
    try {
        await BlogModel.findByIdAndUpdate({_id:postID}, payload)
        res.status(200).send({"msg":"blog Updated"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

// delete route for posts
blogRouter.delete("/delete/:postID", authorize(["Moderator"]), async(req,res)=>{

    const postID=req.params.postID
    try {
        await BlogModel.findByIdAndDelete({_id:postID})
        res.status(200).send({"msg":"blog Deleted"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})



 module.exports = blogRouter