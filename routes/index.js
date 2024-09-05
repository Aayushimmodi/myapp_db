var express = require('express');
var router = express.Router();
var userModel =  require('../Models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', function(req, res, next) {
  var email =  req.body.user_email;
  var password =  req.body.user_password;
  console.log(req.body);
  userModel.findOne({"user_email": email}).then(function(db_users_array){
      console.log('Find one '+db_users_array);
      if(db_users_array){
        var db_email =  db_users_array.user_email;
        var db_password =  db_users_array.user_password;
      }
      console.log("db_users_array.user_email "+db_email);
      console.log("db_users_array.user_password "+db_password);
  if(db_email == null){
    console.log("If");
    res.end('Email not Found');
  }
  else if(db_email == email && db_password == password){
    req.session.email = db_email;
    res.redirect('/home');
  }
  else
  {
    console.log('Credentionals wrong');
    res.end('Login invalid');
  }
})
});

router.get('/home', function(req, res, next) {
  console.log("Home Called " + req.session.email);
  var myemail = req.session.email;
  console.log(myemail);
  if (!req.session.email) {
    console.log("Email Session is Set");
    res.end("Login required to Access this page");
  }
  res.render('home',{myemail:myemail});
});
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

// Insert Record 
router.post('/signup', function(req, res, next) {
  var mybodydata  = {
    user_name :  req.body.user_name,
    user_email :  req.body.user_email,
    user_password :  req.body.user_password
  }
  var mydata =  userModel(mybodydata)
  mydata.save()
  .then(data =>{
    res.send('Record Added.')
  })
  .catch(err => console.log(err));
});
//Display Record 
router.get('/display-table', function(req, res, next) {
  userModel.find()
  .then(data =>{
   //res.json(data);
    //console.log(data);
    res.render('display-table',{mydata:data});
  })
  .catch(err => console.log(err));
});

// Show One Record 
router.get('/show/:id', function(req, res, next) {
  var user_id =  req.params.id;
  userModel.findById(user_id)
  .then(data =>{
  //  console.log(data);
    res.render('show',{mydata:data});
  })
  .catch(err => console.log(err));
});

//Delete
router.get('/delete/:id', function(req, res, next) {
    var user_id  = req.params.id;
    userModel.findByIdAndDelete(user_id)
    .then(data =>{
     res.redirect('/display-table');
    })
    .catch(err => console.log('Error!'+err))
});
//Update 
router.get('/signup-edit/:id', function(req, res, next) {
  var user_id  = req.params.id;
  userModel.findById(user_id)
  .then(data =>{
   res.render('signup-edit',{mydata:data});
  })
  .catch(err => console.log('Error!'+err))
});
router.post('/update/:id', function(req, res, next) {
  var user_id  = req.params.id;
  var mybodydata  = {
    user_name :  req.body.user_name,
    user_email :  req.body.user_email,
    user_password :  req.body.user_password
  }
  userModel.findByIdAndUpdate(user_id,mybodydata)
  .then(data =>{
   res.redirect('/display-table');
  })
  .catch(err => console.log('Error!'+err))
});
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('index');
});
router.get('/forgot-password', function(req, res, next) {
  res.render('forgot-password');
});
    
router.post('/forgot-password', function (req, res, next) {
 
  var email = req.body.user_email;

  console.log(req.body);
 userModel.findOne({"user_email":email}).then(function(db_users_array){
  console.log("Find One " + db_users_array);

    if (db_users_array) {
      var db_email = db_users_array.user_email;
      var db_password = db_users_array.user_password;

    }

    console.log("db_users_array.user_email " + db_email);
    console.log("db_users_array.user_password " + db_password);

    if (db_email == null) {
      console.log("If");
      res.end("Email not Found");
    }
    else if (db_email == email){
      "use strict";
      const nodemailer = require("nodemailer");
      async function main() {
        let account = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "aayushimodi0703@gmail.com",
            pass: "giga irsz euew vhhn",
          }
        });
        let mailOptions = {
          from: 'aayushimodi0703@gmail.com', // sender address
          to: 'aayushimodi0703@gmail.com', // list of receivers
          subject: "Forgot Password", // Subject line
          text: "Hello your password is " + db_password, // plain text body
          html: "Hello your password is " + db_password // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.end("Password Sent on your Email");
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
      main().catch(console.error);
    }
    else {
      console.log("Credentials wrong");
      res.end("Login invalid");
    }
 })
});
router.get('/change-password', function(req, res, next) {
  res.render('change-password');
});
router.post('/change-password', function(req, res, next) {
  if(!req.session.email){
    console.log('Email session is Set.');
    res.render('/login');
  }
  console.log('Home Called'+req.session.email);
    var myemail =  req.session.email;
    var opass =  req.body.opass;
    var npass =  req.body.npass;
    var cpass =  req.body.cpass;
   userModel.findOne({"user_email":myemail})
   .then(function(db_users_array){
    console.log(req.body);
    if(opass == db_users_array.user_password){
        if(opass == npass){
            res.send("New Password must be different then Old Password.");
        }else{
            if(npass == cpass){
              userModel.findOneAndUpdate({"user_email":myemail}, {$set : {"user_password":npass}})
              .then(function() {
                res.send("Password Changed");
              });
            }else{
                res.send("New Password and Confirm Password not match");
            }
        }
    }else{
          res.send("Old Password Not match");
    }
   })
});
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('/index');
});

module.exports = router;
