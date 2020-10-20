const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

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


const userSchema = mongoose.Schema({
    email: String,
    password: String
});
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
    const password = req.body.password;

    const newUser = new User({
        email: email,
        password: password
    });

    newUser.save(function(err) {
        if (!err) {
            res.render("secrets");
        } else {
            console.log(err);
        }
    })
});



app.post("/login", function(req, res) {

    const email = req.body.username;
    const password = req.body.password;

    User.findOne({ email: email }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})






const port = 3000;
app.listen(process.env.PORT || port, function() {
    console.log(`Server started on port ${port}.`);
})