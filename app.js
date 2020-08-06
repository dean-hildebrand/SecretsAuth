require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")
const ejs = require('ejs')

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


// encrypts the password field in database
// grabs environement variable with process.env
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })


const User = new mongoose.model("User", userSchema)


app.get('/', function(req, res){
  res.render("home")
})

app.get('/login', function(req, res){
  res.render("login")
})

app.get('/register', function(req, res){
  res.render("register")
})

// Registers a new user and adds them to the database
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if (!err) {
      res.render("secrets")
    } else {
      console.log(err);
    }
  })
})

// Checking if user is already in the database
app.post('/login', function(req, res){
  const username = req.body.username
  const password = req.body.password

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if(foundUser.password === password){
        res.render("secrets")
      }
    }
  })
})






app.listen(3000, function(){
  console.log("Server started on port 3000");
})
