const hbs = require('hbs');
var express=require("express");
var path=require("path");
var app=express();
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Query_data');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId; 
var nodemailer = require('nodemailer');
const fs = require('fs');
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

var {Query_data} = require('./Query_data');
var {admin} = require('./admin');
var admin=new admin({
  user_name:"admin",
  password:"admin",
  token:""
});
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
var token1 = jwt.sign(admin.password, 'abc123').toString();













app.get("/",function(req,res){
  res.sendFile("public/enquiry_form.html",{root:__dirname});
})














app.post("/post_enquiry",function(req,res){
  var query_data=new Query_data({
    Name:req.body.nam,
    address:req.body.add,
    city:req.body.city,
    state:req.body.state,
    zip:req.body.zip,
    country:req.body.country,
    contact_no:req.body.contact_no,
    dob:req.body.dob,
    email:req.body.emai,
    ed:req.body.edu,
    un:req.body.un,
    yop:req.body.yop,
    ans1:req.body.ans1,
    ans2:req.body.ans2,

    Answer:"Not answered"
  });


  query_data.save();
 res.sendFile("public/enquiry_form.html",{root:__dirname});
})












app.get("/admin_logout",function(req,res){
  
  res.clearCookie('token');
 
  res.sendFile("public/admin_login.html",{root:__dirname});
})












app.post("/after_login",function(req,res){
  if(req.body.uname=="admin" && req.body.psw=="admin"){
    Query_data.find().then((doc)=>{
    
    

const result = doc.filter(docs => docs.Answer=="Not answered");
const list = doc.filter(docs => docs.Answer=="accepted");

    var jsonData = '{"persons":' + JSON.stringify(result) + '}';

    // parse json
    var jsonObj = JSON.parse(jsonData);
    // stringify JSON Object
    var jsonContent = "data = '[" + JSON.stringify(jsonObj) +"]'";
   

    fs.writeFile("public/data.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        
    });



    var jsonData1 = '{"accepted":' + JSON.stringify(list) + '}';
    var jsonObj1 = JSON.parse(jsonData1);
    // stringify JSON Object
    var jsonContent1 = "data1 = '[" + JSON.stringify(jsonObj1) +"]'";
 
    fs.writeFile("public/data1.json", jsonContent1, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
       
    });


    });



    res.cookie('token', token1);
    res.sendFile('public/after_login.html',{root:__dirname});
  }
  else {
    res.sendFile("public/admin_login.html",{root:__dirname});

  }

})














app.get("/admin_login",function(req,res){
 res.sendFile("public/admin_login.html",{root:__dirname});
})













app.post("/response",function(req,res){
 
 var token = req.cookies.token;
  if(token==token1)
  {
	  console.log(req.body.id)
	   console.log(req.body.email)
	  var o_id = new ObjectId(req.body.id);
  Query_data.findOneAndUpdate({_id:o_id}, {$set:{Answer:req.body.ans}},function(err, doc){
	 console.log(doc);
      if(err){
          console.log("Something wrong when updating data!");
      }
    });

    Query_data.find().then((doc)=>{

   
const result = doc.filter(docs => docs.Answer=="Not answered");
const list = doc.filter(docs => docs.Answer=="accepted");

      var jsonData = '{"persons":' + JSON.stringify(result) + '}';
      var jsonObj = JSON.parse(jsonData);
      // stringify JSON Object
      var jsonContent = "data = '[" + JSON.stringify(jsonObj) +"]'";
      
      fs.writeFile("public/data.json", jsonContent, 'utf8', function (err) {
          if (err) {
              console.log("An error occured while writing JSON Object to File.");
              return console.log(err);
          }
          
      });



      var jsonData1 = '{"accepted":' + JSON.stringify(list) + '}';
      var jsonObj1 = JSON.parse(jsonData1);
      // stringify JSON Object
      var jsonContent1 = "data1 = '[" + JSON.stringify(jsonObj1) +"]'";
      
      fs.writeFile("public/data1.json", jsonContent1, 'utf8', function (err) {
          if (err) {
              console.log("An error occured while writing JSON Object to File.");
              return console.log(err);
          }
         
      });



     
  });
 res.sendFile("public/after_login.html",{root:__dirname});

 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'kunjvadodariya040798@gmail.com',
     pass: 'Suvag010660#'
   }
 });

 var mailOptions = {
   from: 'kunjvadodariya040798@gmail.com',
   to: req.body.email,
   subject: 'Answer of your enquiry',
   text:"You are" + req.body.ans
 };

 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });
}
else
  {

      res.sendFile("public/admin_login.html",{root:__dirname});
  }

})












app.listen(3000,()=>{
console.log("server is on at port 3000");
})
