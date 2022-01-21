const mongoose = require("mongoose")

const SessionSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    weeksApplied:{
        type:Array,
        required:true
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    slots:{
        type:Array
    },
    duration:{
        type:String,
        required:true
    },
    serviceId:{
        type:String,
        required:true
    }
})

const Session=mongoose.model('session',SessionSchema)

module.exports=Session

