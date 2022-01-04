const express=require('express')
const Route = express.Router()
const {
    adminLogin,
    adminSignup,
    checkLogin,
    logout,
    forgotPassword,
    verify,
    changePassword,
    changePasswordSettings,
    changeEmail
} =require('../controllers/auth')
const {verifyToken} = require('../Middlewares/auth')

Route.post('/login',adminLogin)
Route.post('/forgotPassword',forgotPassword)
Route.post('/changePassword',changePassword)
Route.post('/changePasswordSetting',verifyToken,changePasswordSettings)
Route.post('/changeEmail',verifyToken,changeEmail)
//Route.post('/signup',adminSignup)

Route.get('/check_login',verifyToken,checkLogin)
Route.get('/verify/:id/:uuid',verify)
Route.get('/logout',logout)


module.exports=Route