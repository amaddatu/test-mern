const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const passport = require("passport");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const Example = require("./exampleModel.js");
const User = require("./models/User");
const passportGoogleAuth = require('passport-google-oauth20');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//remember that this is your connection string.
//we will change this later
if(typeof process.env.MONGODB_URI !== 'undefined' && process.env.MONGODB_URI.length > 0){
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
}
else{
  mongoose.connect("mongodb://localhost/testmern", { useNewUrlParser: true });
}
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ 
  secret: '12346 xyz i dont know it could be anything tomato',
  resave: true, 
  saveUninitialized: true,
  secure: false 
}));
app.use(passport.initialize());
app.use(passport.session());

console.log(
  {
    functionName: "passport use inputs in server.js",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }
);
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
function(accessToken, refreshToken, data, cb) {
  //console.log(data.emails[0].value);
  var email = data.emails[0].value;
  var profileId = data.id;
  //console.log(data.id);
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  // return cb(err, user);
  // });
  User.findOne({
    profileId: profileId
  })
  .then( user => {
    if(!user){
      User.create({
         profileId: profileId,
         email: email
         }).then( user => {
           //create user if not exists
           return cb(null, user);
         });
    }
    //return user if exists
    else{
      return cb(null, user);
    }
  }).catch( err => {
    console.log(err);
    return cb(err, null);
  })
  // User.create({
  //   profileId: profileId,
  //   email: email
  // }).then( user => {
  //   return cb(null, user);
  // }).catch( err => {
  //   console.log(err);
  //   return cb(err, null);
  // });
}
));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Define API routes here
app.get("/michigan", (req, res) => {
  res.json({
    test: "uh Kristine"
  });
});

app.get("/testdb", (req, res) => {

  User.create({
    profileId: "1",
    email: "test@c.com"
  }).then( data => {
    console.log(data);
    res.json(data);
  });

});

require('./routes/api-routes')(app, passport, User);

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});



app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
