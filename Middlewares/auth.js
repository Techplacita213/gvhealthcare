const jwt = require("jsonwebtoken")

module.exports.verifyToken=async (req,res,next)=>{
    try{
        const token = await req.cookies.token||""
        
        if(token===""||!token)
            return res.status(400).send({isLogged:false})
        
        const check=await jwt.verify(token,process.env.JWT_SECRET)
        
        if(!check)
            return res.status(400).send({isLogged:false})
        req.body.id=check.id
    }
    catch(err){
        return res.status(400).send({message:"Not Logged"})
    }
    next();
}