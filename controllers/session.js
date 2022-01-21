const Session=require('../models/Session')
const Slots= require('../models/Slots')
const axios = require('axios')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types
const WeekSlots=require('../models/WeekSlots')
const Doctors = require('../models/Doctors')
const Service = require('../models/Services')

module.exports.get_all=async (req,res)=>{
    const sessions=await  Session.find({serviceId:req.body._id})
    return res.send({sessions:sessions})
}
let arr=[]
let services = ["lab Test","appointment"]
let DURATION = 10;
const duration=(start,duration)=>{
    let timeArr=start.split(':')
    timeArr[0]=parseInt(timeArr[0])
    timeArr[1]=parseInt(timeArr[1])
    let addHrs=parseInt(duration/60)
    duration%=60
    timeArr[0]+=addHrs;
    timeArr[1]+=duration;
    if(timeArr[1]>=60)
        timeArr[0]+=1
    timeArr[1]%=60
    if(timeArr[0]<10&&timeArr[1]<10)
        return `0${timeArr[0]}:0${timeArr[1]}`
    if(timeArr[1]<10)
        return `${timeArr[0]}:0${timeArr[1]}`
    if(timeArr[0]<10)
        return `0${timeArr[0]}:${timeArr[1]}`
    return `${timeArr[0]}:${timeArr[1]}`
}

const compare=(a,b)=>{
    a=a.split(':').join("")
    b=b.split(':').join("")
    if(parseInt(a)>=parseInt(b)){
        return false
    }
    return true
}
const compare2=(a,b)=>{
    a=a.split(':').join("")
    b=b.split(':').join("")
    if(parseInt(a)==parseInt(b)){
        return true
    }
    return false
}
const compare3=(a,b)=>{
    a=a.split(':').join("")
    b=b.split(':').join("")
    if(parseInt(a)>parseInt(b)){
        return true
    }
    return false
}


module.exports.add_session = async (req,res)=>{
    if(!req.body.name)
        return res.status(400).send({message:"Name is required!"})
    let {name,end,days,start,serviceId} =req.body
    if(compare3(start,end)){
        return res.status(400).send({message:"end time must be greater than start time!"})
    }
    const result=await Session.findOne({name:{$regex:name,$options:'i'},serviceId:req.body.serviceId})
    if(result)
        return res.status(400).send({message:"already exists!"})
    //console.log(days)
    const data=new Session({name:name,end:end,start:start,weeksApplied:days,duration:req.body.duration,serviceId:req.body.serviceId,slots:[]})
    //console.log(data)
    //await data.save()
    let s=req.body.start
    arr.push(s)
    while(compare(s,req.body.end)){
        let tmp=duration(s,req.body.duration)
        s=tmp
        console.log("slot",s)
        arr.push(s)
    }
    if(compare2(s,req.body.end)){
        let week=await WeekSlots.findOne({serviceId:req.body.serviceId})
        if(!week)
        week=new WeekSlots({monday:[],tuesday:[],wednesday:[],thrusday:[],friday:[],saturday:[],sunday:[],serviceId:req.body.serviceId})
        //await week.save()
        let slots=[]
        let p=[];
        for(let i=1;i<arr.length;i++){
            p=req.body.days.map(async x=>{
                let slot= new Slots({session: data._id, startTime: arr[i-1], endTime: arr[i]})
                try{
                    await slot.save()
                }catch(err){
                    console.log(err)
                }
                week[x].push(slot._id)
                slots.push(slot._id)
                data.slots.push(slot._id)
            })
            
        }
        Promise.all(p).then(async ()=>{
            await data.save()
            await week.save()
            arr=[]
        })
    }
    else{
        arr=[]
        return res.status(400).send({message:"session time must be a multiple of duration!"})
    }
    
    res.send({message:"Successful!",session:data})
}
module.exports.delete_session = async (req,res)=>{
    if(!req.body.sid)
        return res.status(400).send({message:"id is Required!"})
    const {sid}=req.body
    const session=await Session.findOne({_id:sid})
    await Slots.deleteMany({session:session._id}).then((err,del)=>{
        console.log("error",err)
        console.log("deleted",del)
    })
    const week =await WeekSlots.findOne({serviceId:session.serviceId})
    
    session.weeksApplied.map(day=>{
        week[day]=week[day].filter(id=>!session.slots.includes(id))
    })
    week.save()
    session.remove()
    res.send({message:"Successful"})
}
module.exports.update_by_id=async (req,res)=>{
    arr=[]
    if(!req.body.name)
        return res.status(400).send({message:"Name is required!"})
    let {name,end,days,start} =req.body
    if(compare3(start,end)){
        return res.status(400).send({message:"end time must be greater than start time!"})
    }
  
    const result=await Session.findOne({name:{$regex:name,$options:'i'},serviceId:req.body.serviceId})
    const sessionId=result._id
    await Slots.deleteMany({session:sessionId}).then((err,del)=>{
        console.log("error",err)
        console.log("deleted",del)
    })
    console.log("wise")
    const week =await WeekSlots.findOne({serviceId:result.serviceId})
    
    result.weeksApplied.map(day=>{
        week[day]=week[day].filter(id=>!result.slots.includes(id))
    })
    await week.save()
    await result.remove()
    //console.log(days)
    const data=new Session({name:name,end:end,start:start,weeksApplied:days,duration:req.body.duration,serviceId:req.body.serviceId,slots:[]})
    //console.log(data)
    data._id=sessionId
    //await data.save()
    let s=req.body.start
    arr.push(s)
    while(compare(s,req.body.end)){
        let tmp=duration(s,req.body.duration)
        s=tmp
        console.log(s)
        arr.push(s)
    }
    if(compare2(s,req.body.end)){
        let week=await WeekSlots.findOne({serviceId:req.body.serviceId})
        if(!week)
        week=new WeekSlots({monday:[],tuesday:[],wednesday:[],thrusday:[],friday:[],saturday:[],sunday:[],serviceId:req.body.serviceId})
        //await week.save()
        let slots=[]
        let p=[];
        console.log(arr)
        for(let i=1;i<arr.length;i++){
            p=req.body.days.map(async x=>{
                let slot= new Slots({session: data._id, startTime: arr[i-1], endTime: arr[i]})
                try{
                    await slot.save()
                }catch(err){
                    console.log(err)
                }
                week[x].push(slot._id)
                slots.push(slot._id)
                data.slots.push(slot._id)
            })
            
        }
        Promise.all(p).then(async ()=>{
            await data.save()
            await week.save()
            arr=[]
        })
    }
    else{
        arr=[]
        return res.status(400).send({message:"session time must be a multiple of duration!"})
    }
    
    res.send({message:"Successful!",session:data})
    
}