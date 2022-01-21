const express=require("express")
const Route = express.Router()
const {
    get_orderId,
    razorpay,
    refund
} = require('../controllers/pay')

//Post Routes

Route.post('/get_orderId',get_orderId)
Route.post('/refund',refund)
Route.post('/razorpay',razorpay)

//Get Routes


module.exports=Route