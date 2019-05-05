/*
This is going to be the home of the REST service calls to use
to execute all of my database functions.  These will be called
by Angular services.  I may split this into multiple files if
it gets too big.
*/

// Used to handle any errors encountered by api
sendError = function(res, err, message, status = 500){
    console.log("Error - %s - %s", message, err );
    res.sendStatus(status);
};

module.exports = (function(){
  'use strict';
  var api = require('express').Router();

  // Get blog posts for display
  api.get('/blog/get_posts', function(req, res){
    console.log("getPosts called on BlogService");

    var input = {page: 1, postsPerPage: 3};
    if(req.query.page) input.page = parseInt(req.query.page);
    if(req.query.posts_per_page) input.postsPerPage = parseInt(req.query.posts_per_page);

    // Connect to the database
    var MongoClient = require('mongodb').MongoClient;
    var mongoURI = process.env.MONGOLAB_URI;
    MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
      if(err){
        sendError(res, err, "Unable to connect to MongoDB");
      } else {
        // Get the collection
        var dbo = db.db();
        dbo.collection("blog", function(err, coll){
          if(err){
            return sendError(res, err, "Unable to get collection blog");
          } else {
            // Find all records sorted last to first
            coll.find({}, {sort:{entryTime: -1}}, function(err, items){
              if(err){
                sendError(res, err, "Unable to execute find on blog collection" );
              } else {
                // Get paged data
                items = items.skip(input.postsPerPage * (input.page - 1)).limit(input.postsPerPage);

                // Convert the cursor to an array
                items.toArray(function(err, arr){
                  // Create return JSON with the array and information about paging
                  var ret = {blogPosts: arr, pageInfo: {currentPage: parseInt(input.page)}};

                  // Perform a count to determine how many pages total
                  coll.countDocuments(function(err, count){
                    ret.pageInfo.pageCount = Math.ceil(count / input.postsPerPage);
                    res.send(ret);
                  });
                });
              }
            });
          }
        });
      }
    });
  });

  // api.get()
  return api;
})();
