const express=require("express")
const dotenv = require("dotenv")
const Auth = require('./routes/auth')
const mongoose = require('mongoose')
const cookieParer=require("cookie-parser")
const Slots=require('./routes/slots')
const app=express()
const Session=require('./routes/Session')
const ServiceRoute=require('./routes/service')
const payRoute=require('./routes/pay')
var cron = require('node-cron');
const BookedCount=require('./models/BookedCount')
const companyRoute= require('./routes/company')
const doctorRoute = require('./routes/doctor')
const path = require('path')
const articleRoute = require('./routes/article')

dotenv.config()

mongoose.connect(process.env.MONGO_URL||"",{ useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>{
  console.log("connected to mongodb")
})


app.use(cookieParer())
app.use(express.urlencoded())
app.use(express.json())
app.use('/api/uploads',express.static(path.join(__dirname,'uploads')))
app.use(express.static(__dirname+'/build'))
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://dry-reef-21209.herokuapp.com",
    "https://60eee720b8eb203d7ec44be8--lucid-lichterman-49c626.netlify.app",
    "https://healthcaregv.com",
    "https://www.healthcaregv.com",
    "https://admin.healthcaregv.com"
  ];
  const origin = req.headers.origin;
  if(allowedOrigins.includes(origin)){
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
  });


app.use('/api/admin',Auth)
app.use('/api/slot',Slots)
app.use('/api/session',Session)
app.use('/api/service',ServiceRoute)
app.use('/api/pay',payRoute)
app.use('/api/company',companyRoute)
app.use('/api/doctor',doctorRoute)
app.use('/api/article',articleRoute)

cron.schedule('0 0 0 * * *',async ()=>{
  let result = await BookedCount.find({})
  if(result.length>0){
    result[0].count=0;
    result[0].save()
  }
  else{
    const Doc=new BookedCount({count:0})
    Doc.save()
  }

})

app.get("*",(req,res)=>{
  res.sendFile(__dirname+"/build/index.html")
})


app.listen(process.env.PORT||5000,()=>{
    console.log("Started Listening")
})