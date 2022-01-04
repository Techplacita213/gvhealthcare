const mongoose = require('mongoose')

const SlotSchema=mongoose.Schema({
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    session:{   
        type:mongoose.SchemaTypes.ObjectId,
        ref:"session"
    }
})

const Slot=mongoose.model("slots",SlotSchema)

module.exports=Slot