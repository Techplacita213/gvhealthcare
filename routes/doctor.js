const express=require('express')
const Route=express.Router()
const {verifyToken} = require('../Middlewares/auth')

const {
    addDoctor,
    findDoctorByZipCode,
    getList
}=require('../controllers/doctor')

//Route.post('/get_all',get_all)

//post
Route.post('/addDoctor',addDoctor)

//get
Route.get('/findByZipcode/:zip/:qualification',findDoctorByZipCode)
Route.get('/getList',getList)


module.exports=Route
