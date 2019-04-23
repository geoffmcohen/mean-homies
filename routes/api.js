/*
This is going to be the home of the REST service calls to use
to execute all of my database functions.  These will be called
by Angular services.  I may split this into multiple files if
it gets too big.
*/
module.exports = (function(){
  'use strict';

  var api = require('express').Router();

  // #TODO: This is to test calls to the api, remove later
  api.get('/test', function(req, res){
    console.log('/api/test called.');
  });

  return api;
})();
