const express = require("express");
const User = require("./models/user");
const user = require("./models/user");

var router = express.Router();


router.use(function(req, res, next) { // run for any & all requests
    
    next(); // ..to the next routes from here..
  });

const uname = "admin";
const pword = "admin";

const protection = (req,res,next)=>{
    if (req.session.username){   
        next();
    }else{
        res.redirect("/admin");
    }
}



router.get("/admin",(req,res)=>{
    res.render("admin");
})

router.post("/admin",(req,res)=>{
    const {username,password}=req.body;
    

    if(username === uname && password === pword){
        req.session.username = username;
        res.redirect("/admindashboard");
       
    }else{ 
        // window.alert("Incorrect Username or Password");
        res.redirect("/admin");
       
       
    }
})
router.get("/admindashboard", protection,(req,res)=>{
   User.find({}).lean().exec((err,data)=>{
      res.render("admindashboard",{user:data});
        
    })
})

router.post("/useredit", (req,res)=>{
    const email = req.body.email;
    User.updateOne({email:email},)
})

router.get("/adminedit",(req,res)=>{

    let username = req.body.username;

    res.render("adminedit");
})

router.post("/adminedit", (req,res)=>{
    let email = req.body.email;
    User.findOne({email:email}).lean().exec((err,data)=>{
        if(data){
            res.render("adminedit",{data:data});
          
        }else{
            res.redirect("/admindashboard");
        }
    })
} )

router.post("/editsave", (req,res)=>{
    const {username,email}=req.body;
    user.updateOne({email:email},{$set:{username:username,email:email}},(err)=>{
        if (err){
            throw err;
        }else{
            res.redirect("\admindashboard");
        }
    })
})

router.post("/deleteuser",(req,res)=>{
    const email = req.body.email;
    user.deleteOne({email:email},(err)=>{
        if (err) {
            throw err;
        }else{
            res.redirect("/admindashboard");
        }
    })
})

router.get('/adminlogout', function(req, res) {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect('/admin');
});

module.exports = router;