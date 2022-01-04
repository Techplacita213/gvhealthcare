const mongoose = require('mongoose')

const AdminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    uuid:{
        type:String,
        default:"" 
    }
})

const Admin=mongoose.model("admin",AdminSchema)

module.exports=Admin