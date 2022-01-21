const Slot = require('../models/Slots');
const WeekSlots=require('../models/WeekSlots');
const Session=require('../models/Session')
const BookedSlots= require('../models/BookedSlots');
const BookSlot = require('../models/BookedSlots');
const Services=require('../models/Services')

module.exports.add_by_day=async (req,res)=>{
    if(!req.body.day)
        res.status(400).send({message:"all days are required!"})
    let days=await WeekSlots.findOne({serviceId:req.body.serviceId})
    let week;
    const {day}=req.body
    if(!days){
        days=new WeekSlots({monday:[],tuesday:[],wednesday:[],thrusday:[],friday:[],saturday:[],sunday:[],serviceId:req.body.serviceId})
    }
    let obj=req.body;
    delete obj['day']
    delete obj['id']
    let c=false;
    let check=await Slot.find({...obj}).select('_id')
    check = check.map((obj)=>{
        return obj._id.toString()
    })
    if(check)
    days[day].map((id)=>{
        
        if(check.includes(id.toString())){
            c=true;
            console.log("includes")
        }
            
    })
    if(c)
        return res.status(400).send({message:"alreagy exists!"})
    const slot = new Slot(obj)
    const result = await slot.save()
    if(!result)
        return res.status(400).send({message:"something went wrong!"})
    days[day].push(slot._id)
    await days.save()
    res.send({message:"successful!",slotId:slot._id})
}

module.exports.update_by_id=async (req,res)=>{
    if(!req.body._id)
        return res.status(400).send({message:"id is not provided"})
    let slot= Slot.findOne({_id:req.body._id})
    slot=req.body
    await slot.save()
    res.send({message:"Successful"})
}

module.exports.delete_by_id=async (req,res)=>{
    if(!req.body._id||!req.body.day)
        return res.status(400).send({message:"id is not provided"})
    let week=await WeekSlots.findOne({serviceId:req.body.serviceId})
    let isDeleted=false;
    Slot.deleteOne({_id:req.body._id}).then(()=>{
        res.send({message:"successful"})
        week[req.body.day].filter((obj)=>{
            return obj._id!=req.body._id
        })
        week.save()
    }).catch(err=>{
        res.status(400).send({message:"something went wrong"})
    })
    
}

module.exports.get_week = async (req,res)=>{
    let week=await WeekSlots.findOne({serviceId:req.body.serviceId})

    let slots=await Slot.find({}).populate('session','name')
    let slotStore={}
    slots.map((obj)=>{
        slotStore[obj._id]=obj;
    })
    // if(week.length==0){
    //     let weekdata=new WeekSlots({monday:[],tuesday:[],wednesday:[],thrusday:[],friday:[],saturday:[],sunday:[]})
    //     await weekdata.save()
    //     return res.send(weekdata)
    // }
    let data={monday:[],tuesday:[],wednesday:[],thrusday:[],friday:[],saturday:[],sunday:[]}
    if(!week){
        return res.status(400).send(data)
    }
    const sessions=await Session.find({});

    for(let x in data){
        week[x].map(obj=>{
            
            let s=slotStore[obj]
            if(s)
                data[x].push(s)
        })
    }
    res.send({...data})
}

module.exports.get_booked=async (req,res)=>{
    try{
        const data = await BookSlot.find({}).populate('serviceId','name charge')
        res.send(data)
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }
}

module.exports.get_booked_by_id=async (req,res)=>{
    try{
        const data = await BookSlot.findOne({_id:req.body.id}).populate('serviceId','name charge')
        res.send({detailes:data})
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }
}

module.exports.get_booked_paginate=async (req,res)=>{
    const {currentPage,toSort,by,name,id}=req.body
    try{
        let data;
        if(toSort)
            if(name)
                data = await BookSlot.find({serviceName:name,docid:id}).populate('serviceId','name charge').sort({[by]:1}).skip(10*(currentPage-1)).limit(10)
            else
                data = await BookSlot.find({docid:id}).populate('serviceId','name charge').sort({[by]:1}).skip(10*(currentPage-1)).limit(10)
        else    
            if(name)
                data = await BookSlot.find({serviceName:name,docid:id}).populate('serviceId','name charge').skip(10*(currentPage-1)).limit(10)
            else
                data = await BookSlot.find({docid:id}).populate('serviceId','name charge').skip(10*(currentPage-1)).limit(10)
        const count=await  BookSlot.countDocuments()
        const pageCount=Math.ceil(count/10)
        res.send({bookedSlots:data,pageCount:pageCount})
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }
}

module.exports.get_booked_client=async (req,res)=>{
    try{
        let data = await BookSlot.find({docid:req.params.id},{_id:0})
        res.send(data)
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }
}

module.exports.delete_booked=async (req,res)=>{
    const {serviceId,slotId,date} = req.body
    if(!serviceId||!slotId||!date)
        return res.status(400).send({message:"serviceId, slotId and date are required!"})
    try{
        await BookSlot.deleteOne({serviceId:serviceId,slotId:slotId,date:date})
        res.send({message:"Successful!"})
    }catch(err){
        res.status(400).send({message:"Something went wrong!"})
    }
    
}

module.exports.delete_all=async (req,res)=>{
    BookSlot.deleteMany({},(err)=>{
        if(err)
            console.log(err)
    })
}

module.exports.search_booked_slots=async (req,res)=>{
    const {search}=req.body
    let book=await BookSlot.find({}).populate('serviceId','name charge')
    book=book.filter((obj)=>{
        let n=obj.userDetailes.name.toLowerCase()
        let s=search.toLowerCase()
         return n.includes(s)?obj:null
        }
    )
    res.send({search_results:book,pageCount:Math.ceil(book.length/10)})
}

module.exports.get_detail_booked=async (req,res)=>{
    const {orderId}=req.body
    if(!orderId)
        return res.status(400).send({message:"Something Went Wrong!"})
    const book=await BookSlot.findOne({order_id:orderId})
    res.send({book:book,message:"Thank You For Booking!"})
}

module.exports.change_status=async (req,res)=>{
    if(!req.body.id)
        return res.status(400).send({message:"id is required!"})
    const data=await BookedSlots.findOne({_id:req.body.id})
    data.status=req.body.status
    await data.save()
    res.send({message:"Success"})
}

module.exports.get_report_date=async (req,res)=>{
    const {from,to} = req.body
    if(!from||!to)
        return res.status(400).send({message:"id is required!"})
    const services=await BookSlot.find({}).distinct('serviceName')
    let Ans=await services.map(async obj=>{
       
        const sum=await BookSlot.aggregate([
            {$match:{serviceName:obj,status:{$in:["completed","processing"]},date:{$gte:from,$lte:to}}},
            {
                $group:{
                    _id:null,
                    total:{
                        $sum : "$amount",
                    }
                }
            }
        ])
        
        return {
            revenue:sum[0]?.total||0,
            ServiceName:obj
        }
    })
    Promise.all(Ans).then((data)=>{
       
        res.send(data)
    })
    
}