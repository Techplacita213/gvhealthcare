const express=require('express')
const Route = express.Router()
const {
    add,
    update_by_id,
    delete_by_id,
    get_all,
    get_by_id,
    get_by_doc_id
}= require('../controllers/service')
const {verifyToken} = require('../Middlewares/auth')

Route.post('/add',verifyToken,add)
Route.post('/update_by_id',verifyToken,update_by_id)
Route.post('/delete_by_name',verifyToken,delete_by_id)
Route.post('/get_by_id',get_by_id)

Route.get('/get_all',get_all)
Route.get('/get_by_doc_id/:id',get_by_doc_id)


module.exports=Route