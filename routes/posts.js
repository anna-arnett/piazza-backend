const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Post = require('../models/Post')
const verifyToken = require('../verifyToken')
const {postValidation} = require('../validations/validation')


router.get('/', async(req,res) =>{
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

router.get('/:id', verifyToken, async(req,res) => {
    console.log("User making request:", req.user)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log("Invalid post ID format:", req.params.id)
        return res.status(400).send({message:"invalid post ID format"})
    }
    try {
        //const postId = new mongoose.Types.ObjectId(req.params.id)
        const post = await Post.findById(req.params.id).populate('createdBy', 'user_name')
        if (!post) {
            console.log("post not found for id:", req.params.id)
            return res.status(404).send({message:"post not found"})
        }
        console.log("post found:", post)
        res.send(post)
    } catch (err) {
        console.error("error fetching post by ID:", err)
        res.status(500).send({message: "server error"})
    }
})

router.post('/', verifyToken, async(req,res) => {
    const {error} = postValidation(req.body)
    if (error) {
        return res.status(400).send({message:error})
    }

    try {
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.user._id
        })
        const savedPost = await newPost.save()
        res.status(201).send(savedPost)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

router.put('/:id', verifyToken, async(req,res) =>{
    console.log("user making request:", req.user._id)
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            console.log("post not found")
            return res.status(404).send({message:"Post not found"})
        }

        console.log("post found:", post)
        console.log("post createdBy:", post.createdBy.toString())
        console.log("user iD making request:", req.user._id.toString())

        // check if user is creater of post
        if (post.createdBy.toString() !== req.user._id.toString()) {
            console.log("unauthorized access attempt by:", req.user._id)
            return res.status(403).send({message:"unauthorized"})
        }

        const {error} = postValidation(req.body)
        if (error) {
            return res.status(400).send({message:error})
        }

        post.title = req.body.title
        post.description = req.body.description

        const updatedPost = await post.save()
        res.send(updatedPost)
    } catch (err) {
        console.error("Update error:", err)
        res.status(401).send({message:err})
    }
})

router.delete('/:id', verifyToken, async(req,res) =>{
    console.log("user making delete request:", req.user._id)

    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            console.log("Post not found")
            return res.status(404).send({message: "Post not found"})
        }

        console.log("Post found:", post)
        console.log("Post createdBy:", post.createdBy.toString())
        console.log("User ID making request:", req.user._id.toString())

        if (post.createdBy.toString() !== req.user._id.toString()) {
            console.log("Unauthorized delete attempt by:", req.user._id)
            return res.status(403).send({message:"Unauthorized delete attempt"})
        }

        await Post.deleteOne({_id: req.params.id})
        res.send({message:"post deleted successfully"})
    } catch (err) {
        console.error("delete error:", err)
        res.status(500).send({message: "Server error"})
    }
})

module.exports = router