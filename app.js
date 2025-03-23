const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')

app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', userRoute)


mongoose.connect(process.env.DB_CONNECTOR).then(()=>{
    console.log('DB is connected')
})

app.listen(3000, ()=>{
    console.log('Server is running')
})