require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const encrypt = require("mongoose-encryption"); // level 2 encryption
const md5 = require("md5"); // level 3 hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



var mongoDB = 'mongodb://127.0.0.1/userDB';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// encrypts data when we save() in DB
// Decrypts data when we call find()

// Read what are plugins;
// secret is declared in .env file

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res) {
    res.render("home");
});



app.get("/login", function(req, res) {
    res.render("login");
});



app.get("/register", function(req, res) {
    res.render("register");
});


app.post("/register", function(req, res) {

    const email = req.body.username;
    // const password = md5(req.body.password);
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (!err) {
            const newUser = new User({
                email: email,
                password: hash
            });

            newUser.save(function(err) {
                if (!err) {
                    res.render("secrets");
                } else {
                    console.log(err);
                }
            })
        }
    });
});



app.post("/login", function(req, res) {

    const email = req.body.username;
    // const password = md5(req.body.password);
    const password = req.body.password;


    User.findOne({ email: email }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result == true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
})



const port = 3000;
app.listen(process.env.PORT || port, function() {
    console.log(`Server started on port ${port}.`);
});