const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Post = require('../models/Post')
const {registerValidation,loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req,res)=>{

    // validation 1 to check user input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // validation 2 to check if user exists
    const userExists = await User.findOne({email:req.body.user_email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    // created a hashed representation of password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.user_password,salt)

    // code to insert data 
    const user = new User({
        user_name:req.body.user_name,
        user_email:req.body.user_email,
        user_password:hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).send({message:err})
    }

})

router.post('/login', async(req,res)=>{
    // validation 1 to check user input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // validation 2 to check if user exists
    const user = await User.findOne({user_email:req.body.user_email})
    if(!user){
        return res.status(400).send({message:'User does not exist'})
    }

    // validation 3 to check user password
    const passwordValidation = await bcryptjs.compare(req.body.user_password,user.user_password)
    if(!passwordValidation){
        return res.status(400).send({message:'Password is incorrect'})
    }
    
    // generate an auth-token 
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({'auth-token':token})

})

module.exports = router