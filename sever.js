  const express=require('express');
  const bodyParser=require('body-parser');
   const fs = require('fs');
  //  const readline = require('readline');
   const {google} =require('googleapis');
  //   const request = require('request');
  // var GoogleSpreadsheet = require('google-spreadsheet');
  // var async = require('async') 
  var nodemailer = require('nodemailer');
  const keys =require('./keys.json');  
  const mysql = require('mysql');

const app = express();
 
// 630120298960-9efbi9hljj6jga54s3t4a50gk90p21pj.apps.googleusercontent.com
//_ICWNlEn6_-6-rEnuw7n5-RY
app.use(express.static("../front"));

app.use(bodyParser.urlencoded({extended:false}));

const connection =mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'ieee_task1'
})


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'remonalbear522@gmail.com',
    pass: '**********'
  }
});


const client=new google.auth.JWT(
keys.client_email,null,keys.private_key,['https://www.googleapis.com/auth/spreadsheets']
);


client.authorize((err,tokens) => { 
 if(err){
   console.log(err)
   return;get
 }else{ 
console.log('Connecting');
// gsrun(client);
 }

})


// async function gsrun(client){
//   const gsapi=google.sheets({version:'v4',auth:client });
  // const opt={
  //   spreadsheetId:'1rtcAUULmw2C1qhui5FXbgONoU1uDaZrVL6-HXbkB2S8',
  //   range:'Data!A2:B5'
  // };
 
// let data = await gsapi.spreadsheets.values.get(opt);
// let dataArray=data.data.values;
// let newArray=dataArray.map((arr)=>{
// arr.push(arr[0]+'_'+arr[1]);
// return arr;
// })

// const updateopt={
//   spreadsheetId:'1rtcAUULmw2C1qhui5FXbgONoU1uDaZrVL6-HXbkB2S8',
//   range:'Data!E2',
//   valueInputOption:'USER_ENTERED',
//   resource:{
//     values:newArray,  
//   }
// };
// let res= await gsapi.spreadsheets.values.update(updateopt);
// // console.log(res);

// }




const sendingMails = (email,firstname,lastname) => {


  var mailOptions = {
    from: 'remonalbear522@gmail.com',
    to: email,
    subject: 'IEEE',
    html: `<h1 style='text-align:center; color : blue;'>Thank you for submitting<\h1> <p style='text-align:center;'>${firstname}${lastname}<\p> `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const ubdateData= async (...params) => {

   const gsapi=google.sheets({version:'v4',auth:client });
 
 const updateopt={
  spreadsheetId:'1rtcAUULmw2C1qhui5FXbgONoU1uDaZrVL6-HXbkB2S8',
  range:'Data!A2:J2',
  valueInputOption:"USER_ENTERED",
  resource:{
    values:[params]  
  }
};

let res= await gsapi.spreadsheets.values.append(updateopt);
// console.log(res);

}


app.post('/submit-form',(req,res)=>{

const querystring="INSERT INTO users_data (id, firstname, lastname, phone,email,university,faculty,gender,course1,course2,comment) VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)";
const {firstname,lastname,email,phone,gender,university,Faculty,course1,course2,comment}=req.body;


ubdateData(firstname,lastname,email,phone,gender,university,Faculty,course1,course2,comment);
sendingMails(email,firstname,lastname);
connection.query(querystring,[firstname,lastname,phone,email,university,Faculty,gender,course1,course2,comment],(err,rows,fields) => {
if(err){
  console.log("failed to inserting data ",err);
 res.sendStatus(500);
 return
} else{
  console.log("inserting...");
 }
})
// res.write('../front/thank.html');
// res.render('../front/thank.html');
// res.end();

fs.readFile('../front/thank.html',null,(err,data) => {
   if(err){
     res.writeHead(404);
     res.write('error happen sorry');
   }
   else{
     res.write(data);
   }
   res.end();
})
})

  app.listen(3000,function () {
      console.log("my server is running..");
      
  });  