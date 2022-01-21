const path = require("path");
const multer = require("multer");
const { access, mkdirSync } = require('fs');
const { v4: uuid } = require("uuid");
const firebase =require('firebase-admin')

var firebaseConfig = {
  apiKey: "AIzaSyDF5EKbmxy1C-fGGYNxJSyrxl-fPfDKGos",
  authDomain: "docto-c3271.firebaseapp.com",
  projectId: "docto-c3271",
  storageBucket: "docto-c3271.appspot.com",
  messagingSenderId: "1004016183309",
  appId: "1:1004016183309:web:40b555dc7854ce2b310d44",
  measurementId: "G-Q9MKK3RK4Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userPath = path.join(process.cwd(), "uploads");
    console.log(userPath);
    access(userPath, (err) => {
        if (err) {
            mkdirSync(userPath, { recursive: true });
            cb(null, userPath)
        } else {
            cb(null, userPath)
        }
    })
  },
  filename: function (req, file, cb) {
    // const ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
    cb(null, "app-" + uuid() + "-" + file.originalname);
  },
});

const multerOpts = {
  storage,
  limits: { fileSize: 1024*1024*5 }, //Max 5MB
  fileFilter: (req, file, cb) => {
      cb(null, true);
  },
}

exports.uploadImage = () =>{
  const bucket = firebase.storage().bucket()
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuid()
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',
  };
  const result =  await bucket.upload(uuid(), {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
  });
}