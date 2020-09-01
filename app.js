const express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	User = require('./models/user'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	session = require('express-session'),
	flash = require("connect-flash"),
	methodOverRide = require('method-override'),
	admin = require('./admin');


const dburi = process.env.MONGO || 'mongodb://localhost/auth_app';
const sessionSecret = process.env.SESSION_SECRET || 'believe in yourself';

mongoose.connect(dburi, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'secret',
		resave: false,

		saveUninitialized: false,
		cookie: {
			maxAge:1000*60*60*24
		}
	})
);

app.use(flash());

app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
});
app.use('/', admin);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverRide('_method'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const isAuth = (req, res, next) => {
    if(req.isAuthenticated()){
		res.redirect('/secret')
	}else{
		next()
	}

};

const protect = (req,res,next)=>{
	if(req.isAuthenticated()){
		next()
	}else{
		res.redirect("/login");
	}
};

//================================================
// ROUTES
//================================================

app.get('/',isAuth, (req, res) => {
	res.render('home');
});

app.get('/secret',protect,(req, res) => {
	res.render('secret');
});

// Auth Routes
//show sign up form
app.get('/register',isAuth, (req, res) => {
	res.render('register');
});
//handling user sign up
app.post('/register', (req, res) => {
	username = req.body.username;
	password = req.body.password;
	email = req.body.email;

	User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		
			res.redirect('/login');
		
	});
});

//LOGIN ROUTES
//render login form


app.get("/login", isAuth,(req, res)=>{
    console.log(req.session)
    res.render("login" , {messages : req.flash("error"),username:req.body.username,password:req.body.password} );
});

//login logic
//middleware


app.post('/login',passport.authenticate('local', {
		successRedirect: '/secret',
		failureRedirect: '/login',
		failureFlash:true,
		

		
	
	}),
	(req, res) => {}
);



app.get('/logout', function(req, res) {
	req.logout();
	res.clearCookie('connect.sid');

	res.redirect('/');
});



app.listen(process.env.PORT || 8080, () => {
	console.log('Running');
});
