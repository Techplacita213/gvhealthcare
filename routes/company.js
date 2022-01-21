const express = require('express')
const Route = express.Router()
const {verifyToken} = require('../Middlewares/auth')
const {companyDetailes,
    getDetailes
}=require('../controllers/company')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });

Route.post('/setDetailes',verifyToken,upload.single('logo'),companyDetailes)

Route.get('/getDetailes',getDetailes)

module.exports=Route