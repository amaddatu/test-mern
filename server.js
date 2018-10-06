const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const Example = require("./exampleModel.js");

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
  // Create an object containing dummy data to save to the database
var data = {
  array: ["item1", "item2", "item3"],
  boolean: false,
  string:
    "\"Don't worry if it doesn't work right. If everything did, you'd be out of a job\" - Mosher's Law of Software Engineering",
  number: 42
};

// Save a new Example using the data object
Example.create(data)
  .then(function(dbExample) {
    // If saved successfully, print the new Example document to the console
    console.log(dbExample);
    res.json(dbExample);
  })
  .catch(function(err) {
    // If an error occurs, log the error message
    console.log(err.message);
    res.json({error: "you made a boo boo"});
  });

});

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});



app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
