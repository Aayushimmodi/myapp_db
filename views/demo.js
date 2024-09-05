const userModel = require("../Models/user");

router.post('/login', function(req, res, next) {
    var email =  req.body.user_email;
    var password = req.body.user_password;
    console.log(req.body);
    userModel.findOne({"user_email":email}).then(function(db_users_array){
        console.log("Find One "+db_users_array);
        if(db_users_array){
            var db_email =  db_users_array.user_email;
            var db_password =  db_users_array.user_password;
        }
        console.log(" db_users_array.user_email "+db_email);
        console.log(" db_users_array.user_password "+db_password);
        if(db_email  == null){
            console.log("If");
            res.end("Email not found.");
        }
        else if(db_email == email && db_password == password){
            req.session.email = db_email;
            res.redirect("/home");
        }else{
            console.log("Creditional Wrong.");
            res.end("Login Invalid.");
        }
    })
  });


  router.get('/home', function(req, res, next) {
    console.log("Home Called "+req.session.email);
    var myemail =  req.session.email;
    console.log(mymeail);
    if(!req.session.email){
        console.log("Email session is not set.");
        res.end("Login is required for access this page.");
    }
    res.render('home',{myemail:myemail});
});

router.post('/forgot-password', function(req, res, next) {
        var email =  req.body.user_email;
        console.log(req.body);
        userModel.findOne({"user_email":email}).then(function(db_users_array){
                console.log(req.body);
                if(db_users_array){
                    var db_email =  db_users_array.user_email;
                    var db_password =  db_users_array.user_password;
                }
                console.log("db_users_array.user_email "+db_email);
                console.log("db_users_array.user_password"+db_password);
                if(db_email == null){
                    console.log("If");
                    res.end("Email not found");
                }else(db_email == email){

                }else{
                    console.log("Credtional wrong.");
                    res.end('Login Invalid ');
                }
        })
  });

  router.post('/change-password', function(req, res, next) {
        if(!req.session.email){
            console.log('Émail session is not set.');
            res.render('/login');
        }
        console.log("Home called "+req.session.email);
        var myemail =  req.session.email;
        var opass = req.body.opass;
        var cpass = req.body.cpass;
        if(opass == db_users_array.user_password){
            if(opass == npass){
                    res.end('New Password must be different then old password.');
            }else{
                if(opass== cpass){
                    userModel.findOneAndUpdate({"user_email":myemail},{$set:{"user_password":npass}})
                    .then(function(){
                        res.send('Password chnaged.');
                    })
                }else {
                    res.end("Old Password and confiorm password not match");
                }
            }
        }else{
            res.end('Old Password not match.');
        }
  });