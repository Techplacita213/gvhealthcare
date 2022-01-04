const CompanyDetailes = require('../models/CompanyDetailes')
const fs = require('fs')
const path = require('path')
const { cpuUsage } = require('process')

module.exports.companyDetailes = async (req,res)=>{
    const {name,toDisplay}=req.body
   
    if(!name)
        return res.status(400).send({message:"plz fill all detailes"})
    let company=await CompanyDetailes.find({})
    if(company.length==0){
        company=new CompanyDetailes()
    }else   
        company=company[0]
    
    if(company.companyLogo!==""){
        console.log("dirname",__dirname)
        fs.unlink(path.join(__dirname,"../"+company.companyLogo),(er)=>{
            console.log(er)
        })
    }
    company.companyName=name
    company.companyLogo=req.file?.path||company.companyLogo
    company.displayLogo=toDisplay
    company.about=req.body.about
    await company.save()
    res.send({message:"Successfully Added!"})
}

module.exports.getDetailes=async (req,res)=>{
    let company=await CompanyDetailes.find({})
    if(CompanyDetailes.length==0){
        res.send({companyName:""})
    }else   
        res.send(company[0])
}