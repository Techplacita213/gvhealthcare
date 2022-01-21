const Doctor = require('../models/Doctors')
const axios = require('axios')
const bcrypt = require('bcrypt')

exports.addDoctor = async (req,res) =>{
    const {name,description,qualification,proof,zipcode,profile,password,email} = req.body
    const previousDoctor = await Doctor.findOne({email:email})
    console.log(previousDoctor)
    if(previousDoctor)
        return res.status(400).send({message:"There's doctor present with this email id"})
    const salt =await bcrypt.genSaltSync(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    try{
        const doc = new Doctor({
            name:name,
            description:description,
            qualification:qualification,
            profilePic:profile,
            zipcode:zipcode,
            proof:proof,
            password:hashedPassword,
            email:email
        })
        await doc.save()
        axios.post('http://localhost:5000/api/session/add_session',{docid:doc._id}).then((res)=>{console.log("response",res.data)}).catch(err=>console.log(err.response))
        return res.send({message:"Successfully registered"})
    }
    catch(err){
        console.log(err)
       return  res.status(400).send({message:"Something Went Wrong!"})
    }
}

exports.findDoctorByZipCode = async (req,res) =>{
    try{
        const {zip,qualification} = req.params
        const doc = await Doctor.find({
            zipcode:zip,
            qualification:qualification
        })
        res.send({doctors:doc})
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Something Went Wrong!"})
    }
}

exports.getList = async (req,res) =>{
    try{
        const qualifications = await Doctor.find({}).select('qualification').distinct('qualification')
        
        return res.send({qualifications:qualifications})
    }catch(err){
        console.log(err)
        return res.status(400).send({message:"Something Went Wrong"})
    }
}