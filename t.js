const express = require("express");
const session = require("express-session");
const app = express();

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(session({
    secret: "sjfhdjf",
    resave: false,
    saveUninitialized: false,
    cookie: {
        

    }
}))

const uname = "ashmu";
const pword = "12345";

const protection = (req,res,next)=>{
    if (req.session.username){   
        next();
    }else{
        res.redirect("/login");
    }
}



app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/secret",protection,(req,res)=>{
    res.render("secret");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(username === uname && password === pword){
        req.session.username = username;
        res.redirect("/secret");
    }else{
        res.redirect("/login");
    }
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect('/');
});


app.listen(process.env.PORT || 3001);