const express = require('express');
const User = require('./models/user');
const user = require('./models/user');
const nocache = require("nocache");

var router = express.Router();

router.use(nocache());

router.use(function(req, res, next) {
	// run for any & all requests

	next(); // ..to the next routes from here..
});

const uname = 'admin';
const pword = 'admin';

const protection = (req, res, next) => {
	if (req.session.username) {
		next();
	} else {
		res.redirect('/admin');
	}
};

const isAuth = (req, res, next) => {
	if (req.session.username) {
		res.redirect('/admindashboard');
	} else {
		next();
	}
};

router.get('/admin', isAuth, (req, res) => {
	res.render('admin', { errors: null, username: null });
});

router.post('/admin', (req, res) => {
	const { username, password } = req.body;

	if (username === uname && password === pword) {
		req.session.username = username;
		res.redirect('/admindashboard');
	} else {
		// res.send(500,'showAlert')
		res.render('admin', {
			errors: 'invalid username or password',
			username
		});
	}
});
router.get('/admindashboard', protection, (req, res) => {
	User.find({}).lean().exec((err, data) => {
		res.render('admindashboard', { user: data });
	});
});

router.post('/useredit', (req, res) => {
	const id = req.body.id;
	User.updateOne({ id: id });
});

router.get('/adminedit', (req, res) => {
	let username = req.body.username;

	res.render('adminedit'),{username:username};
});

router.post('/adminedit', (req, res) => {
	const { id,username, email,password } = req.body;
	User.findOne({ id: id }).lean().exec((err, data) => {
		if (data) {
			res.render('adminedit', { data: data });
		} else {
			res.redirect('/admindashboard');
		}
	});
});

router.post('/editsave', (req, res) => {
	const { id,username, email,password } = req.body;
	user.updateOne({ id: id }, { $set: { username: username, email: email,password:password } }, (err) => {
		if (err) {
			throw err;
		} else {
			res.redirect('admindashboard');
		}
	});
});

router.post('/deleteuser', (req, res) => {
	const email = req.body.email;
	
	user.deleteOne({ email: email }, (err) => {
		if (err) {
			throw err;
		} else {
		
			res.redirect('/admindashboard');
		}
	});
});

router.get('/adminlogout', function(req, res) {
	req.session.destroy();
	res.clearCookie('connect.sid');
	res.redirect('/admin');
});

module.exports = router;
