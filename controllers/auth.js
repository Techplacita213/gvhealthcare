const Admin=require('../models/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../utils/email')
const shortid=require('shortid')
const Doctor = require('../models/Doctors')

module.exports.adminLogin=async (req,res)=>{
    if(!req.body.email||!req.body.password)
        return res.status(400).send({message:"Email and password are required!"})
    let type = ""
    const {email,password} = req.body
    let result=await Admin.findOne({email:email})
    if(result)
        type="admin"
    if(!result){
     result = await Doctor.findOne({email:email})
        if(result)
            type="doctor"
    }
    if(!result)
        return res.status(400).send({message:"Invalid Credentials!"})
        
    const check =await bcrypt.compare(password,result.password)

    if(!check)
        return res.status(400).send({message:"Invalid Credentials!"})

    const token=jwt.sign({id:result._id},process.env.JWT_SECRET,{
        expiresIn:60*60*24,
    })

    res.cookie("token",token,{ httpOnly: true,sameSite:"none",secure:true })
    res.send({message:"Successful",type:"doctor"})
}

module.exports.adminSignup=async (req,res)=>{
    if(!req.body.name||!req.body.email||!req.body.password)
        return res.status(400).send({message:"all Detailes are required!"})

    const {name,email,password}=req.body
    const salt =await bcrypt.genSaltSync(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    console.log(hashedPassword)
    let admin;
    const exist=await Admin.findOne({email:email})

    if(!exist)
        admin= new Admin({...req.body,password:hashedPassword})
    else    
        admin=exist

    admin.password=hashedPassword
    const result = await admin.save()

    if(!result)
        return res.status(400).send({message:"an error occured!"})

    res.send({message:"success",data:result})
}

module.exports.checkLogin=async (req,res)=>{
    if(req.body.id)
       return res.send(true)
    res.status(404).send(false)
}

module.exports.logout=async (req,res)=>{
    res.clearCookie("token",{sameSite:"none",secure:true});
    res.send({message:"Successful"})
}

module.exports.forgotPassword=async (req,res)=>{
    const {email}=req.body
    console.log('email',email)
    const admin=await Admin.findOne({email:email})
    if(!admin)
        return res.status(400).send({message:"no user exists with this email!"})
    const uuid=shortid.generate()
    admin.uuid=uuid
    await admin.save()
    const url=`http://booking.nkmathur.com/api/admin/verify/${admin._id}/${uuid}`
    const msg={
        to:email,
        from:"nkmathur@nkmathur.com",
        subject:"Reset Password",
        text:"Click this here to change your password",
        html:`
        <html>
        
        <body >
        <div style="text-align:center;width:100%">
        <h1>Click Here to Reset Password</h1>
        <a href=${url}><button style="background-color:#8b5cf9;border:none;padding:5px;width:200px;height:40px;font-size:20px;color:white">Reset Password</button></a>
        </div>
        </body>

        </html>
        `
    }
    
    if(sendMail(msg)){
        
        return res.send({message:"A reset link has been successfully sent at this email address!"})
    }

    return res.status(400).send({message:"Something Went Wrong!"})
}

module.exports.verify=async (req,res)=>{
    const {id,uuid}=req.params
    if(!id)
        return res.status(400).send({message:"Something Went Wrong!"})
    const admin=await Admin.findOne({_id:id})
    if(uuid===admin.uuid){
        admin.uuid=""
        admin.save()
        res.sendFile(__dirname+'/index.html')
    }
    else    
        res.status(400).send({message:"Expired"})
}

module.exports.changePassword=async (req,res)=>{
    const {id,p}=req.body
    console.log(p,id)
    if(!p||!id)
        return res.status(400).send({message:"Password is required!"})
    const admin=await Admin.findOne({_id:id})
    if(!admin)
        return res.status(400).send({message:"Something Went Wrong!"})
    const salt =await bcrypt.genSaltSync(10)
    const hashedPassword=await bcrypt.hash(p,salt)
    admin.password=hashedPassword
    await admin.save()
    res.send({message:"Password Changed Successfully!"})
}

module.exports.changePasswordSettings=async (req,res)=>{
    const {op,p,cp,id}=req.body
    if(!op||!p||!cp)
        return res.status(400).send({message:"plz fill all detailes"})
        console.log(id)
    let admin=await Admin.findOne({_id:id})
    const check =await bcrypt.compare(op,admin.password)
    if(!check)
        return res.status(400).send({message:"Wrong Password Provided!"})
    if(p!=cp)
        return res.status(400).send({message:"Password and Confirm Password does not match!"})
    const salt =await bcrypt.genSaltSync(10)
    const hashedPassword=await bcrypt.hash(p,salt)
    admin.password=hashedPassword
    await admin.save()
    res.send({message:"Password Changed Successfully!"})
}

module.exports.changeEmail=async (req,res)=>{
    if(!req.body.email)
        return res.status(400).send({message:"Email is required!"})

    const admin=await Admin.findOne({_id:req.body.id})
    admin.email=req.body.email
    await admin.save()
    res.send({message:"Email Changed Successfully!"})
}