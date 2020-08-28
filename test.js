const express = require("express");
const session = require("express-session");
const user = require("./models/user");

const app = express();

const Users = [];

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

const isAuthenticated = function(req, res, next){
    if(!req.session.username){
        res.redirect("/login")
    }
    next();
}

const protectLogin = function(req, res, next){
    if(req.session.username){
        res.redirect("/secret");
    }
    next();
}

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/secret",isAuthenticated, (req, res) => {
    res.render("secret");
})
app.get("/login", protectLogin, (req, res) => {
    // res.render("login");
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/api", (req, res) => {
    res.json(Users);
})

app.post("/register", protectLogin, (req, res) => {
    const { username, password } = req.body;
    const newUser = {
        username: username,
        password: password
    }
    Users.push(newUser);
    res.redirect("/login");
});

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const user = Users.find(user => user.username === username && user.password === password);
    if(user){
        req.session.username = user.username;
        res.redirect("/secret");
    }else{
        res.redirect("/login")
    }
    
})

app.get("/logout", (req, res) => {
    res.clearCookie('connect.sid');
    req.session.destroy();
    res.redirect("/");
})

app.listen(3000, (err) => {
    if(err) throw err;
    console.log(`http:/localhost:3000`);
})