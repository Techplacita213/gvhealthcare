const mongoose = require('mongoose')

const countSchema = mongoose.Schema({
    count:{
        type:Number
    }
})

const Count = mongoose.model('booked_count',countSchema)

module.exports=Count
