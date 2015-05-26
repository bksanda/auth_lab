var express = require('express');
var bodyParser = require('body-parser');
var session = require("express-session");
var bcrypt = require('bcrypt');
var flash = require("connect-flash"); //middleware, do it after session, depends on session.
var app = express();

var db = require('./models');

app.set('view engine','ejs');


//setting up middleware

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: "My secret",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use(function(req,res,next){
    //passing function into req object
    req.getUser = function(){
        return req.session.user || false;
    }
    next();
})


//setting up auth routes

app.get('*', function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts; //alerts from below function is getting inserted. then it will add users to it.
    next();
});

app.get('/',function(req,res){
    var user = req.getUser();
    res.render('index',{user:user}); //user inplace of false (user:false) before
    //putting alerts:alerts is pretty hard alerts:alerts
});

//going to get that message out of the session coming from flash and deletes it
app.get("/", function(req,res){
    res.send(req.flash());
})

app.get('/restricted',function(req,res){
    if (req.getUser()){
        res.render('restricted')
    } else{
        //res.send("access denied!!!");
        req.flash("info","access denied!!! Please login to view this page");
        res.redirect('/');
    }
});

//login form
app.get('/auth/login',function(req,res){
    res.render('login');
});

app.post('/auth/login',function(req,res){
    //login here (check password and set session value)
    //res.send(req.body);
    db.user.find({where:{email:req.body.email}}).then(function(userObj){
        if(userObj){
            //check password
            bcrypt.compare(req.body.password, userObj.password, function(err, match){
                if (match === true) {
                    //store user object in session
                    req.session.user = {
                        id: userObj.id,
                        email: userObj.email,
                        name: userObj.name
                    };
                    res.redirect("/");
                    //res.send("correct password");
                } else {
                    //res.send("Invalid Password.");
                    req.flash("info","Invalid Password.");
                    res.redirect("/auth/login");
                }
            });
            //res.send("we will check your password");
        } else {
            //res.send("Unknown user.");
            req.flash("info","Unknown user.");
            res.redirect("/auth/login");
        }
        //res.send(userObj);
    })
    //user is logged in forward them to the home page
    //res.redirect('/');
});

//sign up form
app.get('/auth/signup',function(req,res){
    res.render('signup');
    //req.flash("info","oops try again");
    //req.redirect('/');
});

app.post('/auth/signup',function(req,res){
    //sign up here (add user to database)

    var userData = {
        email:req.body.email,
        password: req.body.password,
        name: req.body.name
    };

    var findUser = {
        email:req.body.email
    };

    db.user.findOrCreate({where:findUser,defaults:userData}) // defaults: {name: req.body.name, email:req.body.email, password: req.body.password}
    .spread(function(user,created){
    //user is signed up forward them to the home page
    //res.redirect('/');
        if(created){
            // req.flash("info", "Thanks! Your account is ready!");
            res.send('Created User');
            // res.redirect('/');
        } else {
            // req.flash("info", "You already have an account");
            // res.redirect("/auth/signup");
            res.send('Account already exists');
        };
    })
    .catch(function(error){
        if(error && Array.isArray(error.errors)){
            error.errors.forEach(function(errorItem){
                 req.flash("danger",errorItem.message);
            });
        }else {
            //res.send('unknown error');
            req.flash('danger','unknown user');
        }
        res.redirect('/auth/signup');
    })

});

//logout
//sign up form
app.get('/auth/logout',function(req,res){
    //res.send('logged out');
    delete req.session.user;
    req.flash('info', "You have been logged out."); //takes two params, what type of message and message -- takes bootstrap what type
    res.redirect("/");
});

app.listen(3000);