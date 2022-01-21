const mongoose = require('mongoose')

const ratingSchema=mongoose.Schema({
    docid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"doctor"
    },
    rating:{
        type:mongoose.SchemaTypes.Number,
        required:true
    }
})

const Service = mongoose.model('rating',ratingSchema)
module.exports=Service