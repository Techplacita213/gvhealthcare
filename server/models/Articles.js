const mongoose = require('mongoose')

const ArticleSchema=mongoose.Schema({
    pic:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    link:{
        type:String,
        default:"" 
    },
    uid:{
        type:mongoose.Types.ObjectId
    }
})

const Article=mongoose.model("article",ArticleSchema)

module.exports=Article