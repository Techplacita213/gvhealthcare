const express=require('express')
const Route=express.Router()
const {verifyToken} = require('../Middlewares/auth')
const {
    addArticle,
    deleteArticle,
    editArticle,
    getAll,
    getAllAdmin
}=require('../controllers/articles')

//Route.post('/get_all',get_all)

//post
Route.post('/addArticle',verifyToken,addArticle)
Route.post('/editArticle',editArticle)

//delete
Route.delete('/deleteArticle/:id',deleteArticle)

//get
Route.get('/getAll',getAll)
Route.get('/getAllAdmin',verifyToken,getAllAdmin)


module.exports=Route
