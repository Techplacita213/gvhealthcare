const mongoose = require('mongoose')

const WeekSchema=mongoose.Schema({
    monday:{
        type:Array
    },tuesday:{
        type:Array
    },wednesday:{
        type:Array
    },thrusday:{
        type:Array
    },friday:{
        type:Array
    },saturday:{
        type:Array,
    },
    sunday:{
        type:Array
    },
    serviceId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"service"
    },
    docid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"doctor"
    }
})

const WeekSlots = mongoose.model('weekslots',WeekSchema)

module.exports=WeekSlots