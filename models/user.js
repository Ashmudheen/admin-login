var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const number = require("mongoose/lib/cast/number");


var UserSchema = new mongoose.Schema({
    id: String,
    username : String,
    password : String,
    email : String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);