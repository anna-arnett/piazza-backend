const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('auth-token')
    console.log("received token:",token)
    if(!token){
        console.log("No token provided")
        return res.status(401).send({message:'Access denied: no token provided'})
    }
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        console.log("verified token:", verified)
        req.user=verified
        next()
    } catch(err){
        console.error("token verification error:", err)
        return res.status(401).send({message:'Invalid token'})
    }
}

module.exports=auth