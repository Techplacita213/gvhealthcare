const mongoose = require('mongoose')

const serviceSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    charge:{
        type:Number,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    description:{
        type:String,
        default:""
    },
    docid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"doctor"
    }
})

const Service = mongoose.model('service',serviceSchema)
module.exports=Service