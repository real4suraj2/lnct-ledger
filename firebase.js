const firebase=require('firebase')
 // Initialize Firebase
  var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID
};
  firebase.initializeApp(config);
 var database = firebase.database();
var ledge=(name,branch)=>{
var date=new Date();
var day=date.getDate();
var month=parseInt(date.getMonth())+1;
var trueDate=String(day)+':'+String(month)
var serve=trueDate+String(name)
database.ref(serve).set({Branch:String(branch)});


}
module.exports={ledge};

