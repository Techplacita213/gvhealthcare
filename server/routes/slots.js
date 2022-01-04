const express = require('express')
const Route=express.Router()
const {verifyToken} = require('../Middlewares/auth')
const {
    add_by_day,
    update_by_id,
    delete_by_id,
    get_week,
    get_booked,
    get_booked_client,
    delete_booked,
    delete_all,
    get_booked_paginate,
    get_booked_by_id,
    search_booked_slots,
    get_detail_booked,
    change_status,
    get_report_date
}= require('../controllers/slots')

//Post Routes

Route.post('/add_by_day',add_by_day)
Route.post('/update_by_id',verifyToken,update_by_id)
Route.post('/delete_by_id',verifyToken,delete_by_id)
Route.post('/delete_booked',delete_booked)
Route.post('/get_week',get_week)
Route.post('/get_booked_paginate',verifyToken,get_booked_paginate)
Route.post('/get_booked_by_id',get_booked_by_id)
Route.post('/search_booked_slots',search_booked_slots)
Route.post('/get_detail_booked',get_detail_booked)
Route.post('/change_status',change_status)
Route.post('/get_report_date',get_report_date)
//Get Routes

Route.get('/get_booked',get_booked)
Route.get('/get_booked_client/:id',get_booked_client)
//Route.get('/delete_all',delete_all)
module.exports=Route
