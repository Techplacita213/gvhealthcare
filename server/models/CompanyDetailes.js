const mongoose = require('mongoose')

const CompanyDetailesSchema = mongoose.Schema({
    companyLogo:{
        type:String,
        default:""
    },
    companyName:{
        type:String,
        default:""
    },
    displayLogo:{
        type:Boolean,
        default:false
    },
    about:{
        type:Array,
        default:[]
    }
}) 
const CompanyDetailes = mongoose.model('companydetailes',CompanyDetailesSchema)
module.exports=CompanyDetailes