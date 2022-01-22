import firebase from 'firebase'
import {v4 as uuid} from 'uuid'
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
let fire=firebase.initializeApp(firebaseConfig);

const ref =  firebase.storage().ref()

export async function uploadFile(file){

// Create a reference to 'mountains.jpg'
var mountainsRef = ref.child(file.name);

// Create a reference to 'images/mountains.jpg'
var mountainImagesRef = ref.child('images/'+file.name);

  const metadata={
      type:file.type
  }
  var uploadTask = ref.child('images/'+file.name).put(file, metadata);

  let url= await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{
    return downloadURL
  }
    );
  return url
}



