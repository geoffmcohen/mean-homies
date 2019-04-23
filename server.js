//Install express server
const express = require('express');
const path = require('path');

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
app.listen(process.env.PORT || 3000);
