const Razorpay = require('razorpay')
const shortid = require('shortid')
const Service= require('../models/Services')
const BookSlot=require('../models/BookedSlots')
const BookCount = require('../models/BookedCount')
const Slot = require('../models/Slots')
const axios = require('axios')

var instance = new Razorpay({
    key_id: 'rzp_test_JKeEnNSDHaPfk5',
    key_secret: 'XRdKuaCxpj63LwQWkC8jSomK'
  })
  let numDatMapping={
    "0":"sunday",
    "1":"monday",
    "2":"tuesday",
    "3":"wednesday",
    "4":"thrusday",
    "5":"friday",
    "6":"saturday"
}


module.exports.get_orderId=async (req,res)=>{
    const {serviceId,sId,date,name,email,phone}=req.body
    if(!serviceId||!sId||!date)
        return res.status(400).send({message:"plz send all info!"})
    const slot = await Slot.findOne({_id:sId})
    const result = await BookSlot.findOne({serviceId:serviceId,slotDetailes:{startTime:slot.startTime,endTime:slot.endTime,day:numDatMapping[new Date(date).getDay()]},date:date})
    if(result)
        return res.status(400).send({messge:"already Booked!"})
    const service= await Service.findOne({_id:serviceId})
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '_' + dd + '_' + yyyy;

    let Book = await BookCount.find({})

    if(!Book.length)
        Book=new BookCount({count:0})
    else    
        Book=Book[0]
    
    
    Book.count++;
    await Book.save()
    let last=`${Book.count}`.padStart(3,'0')
    let receipt=`order_${today}_${last}`
    var options = {
        amount: service.charge*100, // amount in the smallest currency unit
        currency: "INR",
        receipt:  receipt,
        payment_capture:1
    };
    
    instance.orders.create(options,async function(err, order) {
        
        if(err){
            return res.status(400).send(err)
        }
        
        const book = new BookSlot({
            serviceId:serviceId,
            slotDetailes:{
                startTime:slot.startTime,
                endTime:slot.endTime,
                day:numDatMapping[new Date(date).getDay()]
            },
            userDetailes:{
                name:name,
                email:email,
                phone:phone
            },
            date:date,
            order_id:order.id,
            receipt:receipt,
            amount:service.charge,
            serviceName:service.name,
            docid:service.docid
        })
        book.save()
        res.send({order_id:order.id,serviceName:service.name})
    });
}
module.exports.razorpay=async (req,res)=>{
    const secret = process.env.WEBHOOK_SECRET||""

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')


	if (digest === req.headers['x-razorpay-signature']) {
		const {id,order_id,error_code}=req.body.payload.payment.entity
        if(error_code){
            await BookSlot.deleteOne({order_id:order_id})
            return
        }
        const result=await BookSlot.findOne({order_id:order_id})
        if(!result)
            return res.status(400).send({message:"Something went wrong!"})
        result.tid=id
        result.status="processing"
        result.save()
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
} 
module.exports.refund=async (req,res)=>{
    const {tid,amount}=req.body
    axios.post(`https://rzp_test_T4VluIcPFfK6pS:XdPnxVKpNbn6T9mRf4bhFVOx@api.razorpay.com/v1/payments/${req.body.tid}/refund`,{amount:amount}).then((res2)=>{
        
        BookSlot.deleteOne({tid:tid}).then((err,del)=>{
            if(err)
                console.log("errorDelete",err)
            console.log(del)
        })
        res.send({message:"Successful"})
    }).catch(err=>{
        res.status(400).send({message:err.response.data.error.description})
    })
}