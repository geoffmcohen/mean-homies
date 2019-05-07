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

    // #TODO: Move this into module
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

  // Attempt to authenticate admin user
  api.post('/admin/login', function(req, res){
    console.log('api/admin/login called');

    var admin = require("../modules/admin.js");
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      admin.authenticateAdminUser(fields.username, fields.password, function(err, authResult){
        if(authResult){
          var jwt = require('jsonwebtoken');
          var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';

          var payload = {
            username: req.query.username,
            userType: 'admin'
          };

          jwt.sign(payload, jwtSecret, {expiresIn: '1h'}, function(err, token){
            if(err){
              sendError(res, err, "Unable to sign in admin user");
            } else {
                res.send({success: true, message: "", token: token});
            }
          });
        } else {
          // #TODO: Make this more accurate so we can display better messages
          res.send({success: false, message: "Wrong username/password combination"});
        }
      });
    });
  });

  // Used to verify a user token to ensure they are still logged in
  api.post('/admin/verify_user', function(req, res){
    console.log('api/admin/login called');

    var admin = require("../modules/admin.js");
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      var jwt = require('jsonwebtoken');
      var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';
      jwt.verify(fields.token, jwtSecret, function(err, decoded){
        if(err){
          res.send({success: false, error: err});
        } else {
          console.log("Decoded username = %s", decoded.username);
          res.send({success: true});
        }
      });
    });
  });

  // api.get()

  return api;
})();
