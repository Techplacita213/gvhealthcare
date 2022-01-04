const mongoose = require('mongoose')

const doctorSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    proof:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }
})

const Service = mongoose.model('doctor',doctorSchema)
module.exports=Service