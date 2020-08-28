const express = require("express"),
     mongoose = require("mongoose"),
     passport = require("passport"),
     bodyParser = require("body-parser"),
     User       = require("./models/user"),
     LocalStrategy = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose"),
     session = require("express-session"),
     methodOverRide = require("method-override"),
     admin = require("./admin")
    




const dburi = process.env.MONGO || "mongodb://localhost/auth_app";
const sessionSecret = process.env.SESSION_SECRET || "believe in yourself";

mongoose.connect(dburi, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});


var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: "secret",
    resave: false,
   
    saveUninitialized: false,
    cookie:{
        httpOnly: false,

    }
    
}));

app.use("/",admin);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverRide('_method'));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================================================
// ROUTES
//================================================

app.get("/", (req,res)=>{
    res.render("home");
})

app.get("/secret", isLoggedIn, (req,res)=>{
    res.render("secret");
})

// Auth Routes
//show sign up form
app.get("/register",(req,res)=>{
    res.render("register");
})
//handling user sign up
app.post("/register", (req,res)=>{
     
     username = req.body.username;
     password = req.body.password;
     email = req.body.email;
    
    User.register(new User({username: req.body.username, email:req.body.email}),req.body.password,(err,user)=>{
        if(err){ 
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res,()=>{
            res.redirect("/login");
        })
    });
    
});

//LOGIN ROUTES
//render login form
app.get("/login",(req,res)=>{
    res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),(req,res)=>{
});


app.get('/logout', function(req, res) {
    req.logout();
    res.clearCookie("connect.sid");
    
    res.redirect('/');
});

  

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


 
app.listen(process.env.PORT || 8080, ()=>{
    console.log("Running");
});