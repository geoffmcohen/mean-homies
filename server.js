//Install express server
const express = require('express');
const path = require('path');

// Connect to mongodb and fail if unable to connect
var MongoClient = require('mongodb').MongoClient;
var mongoURI = process.env.MONGOLAB_URI;
MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
  if(err){
    console.log("Unable to connect to MongoDB!!!");
    throw err;
  } else {
    console.log("Vegan Homies is running...");
  }
});

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/mean-homies'));

// Send api requests to api to a separate module
var api = require('./routes/api.js');
app.use('/api', api);

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/mean-homies/index.html'));
});

// Start the app by listening on the default Heroku port
const server = app.listen(process.env.PORT || 3000);

// Initializes the real time notification service
require('./modules/real-time.js').init(server);
