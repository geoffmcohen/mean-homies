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
    res.send({data: 'test'});
  });

  // Get blog posts for display
  // #TODO: Need to figure out how errors should be handled here
  api.get('/blog/get_posts', function(req, res){
    var input = {postsPerPage: 3, page: 1};
    if(req.query.page) input.page = req.query.page;

    // Connect to the database
    var MongoClient = require('mongodb').MongoClient;
    var mongoURI = process.env.MONGOLAB_URI;
    MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
      // Callback with error if unable to connect
      if(err){
        console.log("Unable to connect to MongoDB!!!");
        //return callback(err, null);
        res.send({err: err, results: null});
      }
      // Get the collection
      var dbo = db.db();
      dbo.collection("blog", function(err, coll){
        if(err){
          console.log("Unable to get collection blog!!!");
          //return callback(err, null);
          res.send({err: err, results: null});
        }
        // Find all records sorted last to first
        coll.find({}, {sort:{entryTime: -1}}, function(err, items){
          if(err){
            console.log("Unable to execute find on blog collection");
            //return callback(err, null);
            res.send({err: err, results: null});
          }

          // Get paged data
          items = items.skip(input.postsPerPage * (input.page - 1)).limit(input.postsPerPage);

          // Convert the cursor to an array
          items.toArray(function(err, arr){
            // Create return JSON with the array and information about paging
            var ret = {blogPosts: arr, pageInfo: {currentPage: parseInt(input.page)}};

            // Perform a count to determine how many pages total
            coll.countDocuments(function(err, count){
              ret.pageInfo.pageCount = Math.ceil(count / input.postsPerPage);
              //return callback(err, ret);
              res.send({err: err, results: ret});
            });
          });
        });
      });
    });
  });

  return api;
})();
