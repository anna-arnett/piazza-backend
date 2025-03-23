const express = require('express')
const router = express.Router()

const user = require('../models/user')
const verifyToken = require('../verifyToken')

router.get('/', verifyToken, async(req,res) =>{
    try {
        const users = await user.find()
        res.send(users)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

module.exports = router