const Service = require('../models/Services')
const Slot=require('../models/Slots')
const WeekSlot=require('../models/WeekSlots')
const Session= require('../models/Session')
const Admin=require('../models/Admin')
const bcrypt=require('bcrypt')

module.exports.add=async (req,res)=>{
    if(!req.body.name||!req.body.charge)
        return res.status(400).send({message:"Name and Charge is required!"})
    let result = await Service.findOne({name:{$regex:req.body.name,$options:'i'},docid:req.body.id})
    if(result)
        return res.status(400).send({message:"already exists!"})
    const service=new Service({name:req.body.name,charge:req.body.charge,description:req.body.description,docid:req.body.id})
    service.active=req.body.status
    try{
        await service.save()
        res.send({message:"Successfull!",service:service})
    }
    catch(err){
        res.status(400).send({message:"Something went wrong!"})
    }
}   

module.exports.update_by_id=async (req,res)=>{
    if(!req.body._id||!req.body.name||!req.body.charge)
        return res.status(400).send({message:"charge and name is required!"})
    //let check= await Service.findOne({name:{$regex:req.body.name,$options:'i'}})
    let result = await Service.findOne({_id:req.body._id})
    if(!result)
        return res.status(400).send({message:"Not Found!"})
    // if(check&&check._id.toString()!==req.body._id)
    //     return res.status(400).send({message:"Service With This Name Already exists!"})
    result.name=req.body.name
    result.charge=req.body.charge
    result.active=req.body.status
    result.description=req.body.description
    try{
        await result.save()
        return res.send({message:"Successful"})
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Someting went wrong!"})
    }
}

module.exports.delete_by_id=async (req,res)=>{
    if(!req.body._id||!req.body.pass)
        return res.status(400).send({message:"id ans pass is Required!"})
    const {_id,id,pass}=req.body
    
    const admin=await Admin.findOne({_id:id})
    console.log(admin)
    const check =await bcrypt.compare(pass,admin.password)
    if(!check)
        return res.status(400).send({message:"wrong credentials!"})
    WeekSlot.deleteOne({serviceId:_id})
    Slot.deleteMany({serviceId:_id})
    Session.deleteMany({serviceId:_id})
    Service.deleteOne({_id:_id}).then((err)=>{
        console.log(err)
    })
    res.send({message:"Successful!"})
}


module.exports.get_all=async (req,res)=>{
    const Data = await Service.find({docid:req.body.id})
    const result = await Service.count({active:true,docid:req.body.id})
    res.send({services:Data,activeServices:result})
}

module.exports.get_by_id=async (req,res)=>{
    if(!req.body.id)
        return res.status(400).send({message:"id is required!"})
    const data=await Service.findOne({_id:req.body._id})
    if(!data)
        return  res.send({message:"Not Found!"})
    console.log(data)
    res.send(data)
}

module.exports.get_by_doc_id = async (req,res)=>{
    const {id} = req.params;
    console.log(req.params)
    if(!id)
        return res.status(400).send({message:"id is required!"})
    const data=await Service.find({docid:id,active:true})
    const result = await Service.count({active:true})
    res.send({services:data,activeServices:result})
}
