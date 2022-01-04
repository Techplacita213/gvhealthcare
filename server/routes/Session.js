const express=require('express')
const Route=express.Router()
const {verifyToken} = require('../Middlewares/auth')
const {
    get_all,
    add_session,
    delete_session,
    update_by_id,
}=require('../controllers/session')

Route.post('/get_all',get_all)


Route.post('/add_session',add_session)
Route.post('/delete_session',verifyToken,delete_session)
Route.post('/update_by_id',verifyToken,update_by_id)

module.exports=Route
