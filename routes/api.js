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
      // #TODO: This should be moved into admin module
      admin.authenticateAdminUser(fields.username, fields.password, function(err, authResult){
        if(authResult){
          var jwt = require('jsonwebtoken');
          var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';

          var payload = {
            username: fields.username,
            userType: 'admin'
          };

          jwt.sign(payload, jwtSecret, {expiresIn: '6h'}, function(err, token){
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
    console.log('api/admin/verify_user called');

    var admin = require("../modules/admin.js");
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      // Check the adminToken here
      var admin = require("../modules/admin.js")
      admin.verifyUser(fields.token, fields.username, 'admin', function(err, result){
        res.send({success: result, error: err});
      });
    });
  });

  // Post method for creating a blog posts
  api.post('/admin/create_blog_post', function(req, res){
    console.log('api/admin/create_blog_post called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    //var blogPost = {author: req.session.adminUser};
    var blogPost = {};
    var adminToken = null;
    var adminUser = null;

    // Set the file path for the image file
    form.on('file', function(field, file){
      if(file.size > 0) blogPost.image_file = file.path;
    });

    // Get the user information for authentication and build the JSON for the post
    form.on('field', function(field, value){
      if(field == 'adminToken') {
        adminToken = value;
      } else if (field == 'adminUser') {
        adminUser = value;
        blogPost.author = adminUser;
      } else {
        blogPost[field] = value;
      }
    });

    // Once all of the fields are consumed now we do the real work
    form.on('end', function(){
      // Check to make sure adminUser and adminToken were providedIn
      if (!adminUser || !adminToken){
        res.send({success: false, message: 'Missing parameters for adminUser and/or adminToken'})
      } else {
        // Check the adminToken here
        var admin = require("../modules/admin.js")
        admin.verifyUser(adminToken, adminUser, 'admin', function(err, result){
          if(!result){
            console.log("Unable to verify token for admin user %s", adminUser);
            console.log(err);
            res.send({success: false, message: "Unable to verify admin user"});
          } else {
            // Now attempt to create the post
            var blog = require("../modules/blog.js");
            blog.insertBlogPost(blogPost, function(err, result){
              if(err){
                console.log("Unable to post to blog");
                console.log(err);
                res.send({success: false, message: "Blog post failed to insert"});
              } else {
                res.send({success: true, message: "Blog post successfully inserted"})
              }
            });
          }
        });
      }
    });

    // Parse the form to kick off the processing
    form.parse(req);
  });
  // api.get()

  return api;
})();
