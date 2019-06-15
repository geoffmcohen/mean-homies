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
    console.log("api/blog/get_posts called");

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

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Authenticate the user
      var auth = require('../modules/auth.js');
      auth.login(fields.username, fields.password, 'admin', function(token, message){
        var success = false;
        if( token ) success = true;
        res.send({success: success, message: message, token: token});
      });
    });
  });

  // Used to verify a user token to ensure they are still logged in
  api.post('/admin/verify_user', function(req, res){
    console.log('api/admin/verify_user called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Check the adminToken here
      var auth = require("../modules/auth.js")
      auth.verifyUser(fields.token, fields.username, 'admin', function(err, result){
        res.send({success: result, error: err});
      });
    });
  });

  // Post method for creating a blog posts
  api.post('/admin/create_blog_post', function(req, res){
    console.log('api/admin/create_blog_post called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
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
      // Check to make sure adminUser and adminToken were provided
      if (!adminUser || !adminToken){
        res.send({success: false, message: 'Missing parameters for adminUser and/or adminToken'})
      } else {
        // Check the adminToken here
        var auth = require("../modules/auth.js")
        auth.verifyUser(adminToken, adminUser, 'admin', function(err, result){
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

  // Increments the page count for a page/component
  api.post('/increment_page_count', function(req, res){
    console.log('api/increment_page_count called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      if(fields.pageName) {
        require('../modules/page-counter.js').incrementPageCount(fields.pageName, function(err, result){});
      };
    });
  });

  // Gets the page Counts
  api.get('/admin/get_page_counts', function(req, res){
    console.log('api/admin/get_page_counts called');

    var pageCounter = require('../modules/page-counter.js');
    pageCounter.getPageCounts(function(err, results){
      if (err) {
        sendError(res, err, "Unable to get page counts");
      } else {
        res.send({results: results});
      }
    });
  });

  // Creates a new user
  api.post('/user/create_user', function(req, res){
    console.log('api/user/create_user called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      var user = require("../modules/user.js");
      user.createUser(fields.email, fields.username, fields.password, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Activates a new user account
  api.get("/user/activate_user", function(req, res){
    console.log('api/user/create_user called');

    var user = require("../modules/user.js");
    user.activateUserAccount(req.query.username, req.query.activationCode, function(success, message){
      var util = require('util');
      res.send(util.format("<p>%s</p><p>Please close this browser window or tab.</p>", message));
    });
  });

  // Attempt to authenticate a user
  api.post('/user/login', function(req, res){
    console.log('api/user/login called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Authenticate the user
      var auth = require('../modules/auth.js');
      auth.login(fields.username, fields.password, 'user', function(token, message, actualUsername){
        var success = false;
        if( token ) success = true;
        res.send({
          success: success,
          message: message,
          token: token,
          actualUsername: actualUsername
        });
      });
    });
  });

  // Used to verify a user token to ensure they are still logged in
  api.post('/user/verify_user', function(req, res){
    console.log('api/user/verify_user called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Check the adminToken here
      var auth = require("../modules/auth.js")
      auth.verifyUser(fields.token, fields.username, 'user', function(err, result){
        res.send({success: result, error: err});
      });
    });
  });

  // Checks to see if an email address is already attached to a user account
  api.post('/user/is_email_taken', function(req, res){
    console.log('api/user/is_email_taken called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      var user = require("../modules/user.js");
      user.checkIfEmailIsTaken(fields.email, function(result){
        res.send({taken: result});
      });
    });
  });

  // Checks to see if a username is already attached to a user account
  api.post('/user/is_username_taken', function(req, res){
    console.log('api/user/is_username_taken called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      var user = require("../modules/user.js");
      user.checkIfUsernameIsTaken(fields.username, function(result){
        res.send({taken: result});
      });
    });
  });

  // Sends a password reset email
  api.post('/user/request_password_reset', function(req, res){
    console.log('api/user/request_password_reset called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Request the password reset
      var user = require("../modules/user.js");
      user.requestPasswordReset(fields.email, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Reset the users password
  api.post('/user/reset_password', function(req, res){
    console.log('api/user/reset_password called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Request the password reset
      var user = require("../modules/user.js");
      user.resetPassword(fields.email, fields.newPassword, fields.token, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Change the users password
  api.post('/user/change_password', function(req, res){
    console.log('api/user/change_password called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Request the password reset
      var user = require("../modules/user.js");
      user.changePassword(fields.username, fields.oldPassword, fields.newPassword, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Gets a user profile
  api.get('/user/get_profile', function(req, res){
    console.log('api/user/get_profile called');

    var user = require("../modules/user.js");
    user.getUserProfile(req.query.token, req.query.username, function(success, profile){
      res.send({success: success, profile: profile});
    });
  });

  // Saves a users profile
  api.post('/user/save_profile', function(req, res){
    console.log('api/user/save_profile called');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Request the password reset
      var user = require("../modules/user.js");
      user.saveUserProfile(
        fields.token,
        fields.username,
        fields.displayName,
        fields.aboutMe,
        fields.lookingToMeet,
        fields.location,
        fields.lat,
        fields.lng,
        fields.city,
        fields.stateProvince,
        fields.country,
        function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Gets a user profile picture
  api.get('/user/get_profile_picture', function(req, res){
    console.log('api/user/get_profile_picture called');

    var user = require("../modules/user.js");
    user.getUserProfilePicture(req.query.token, req.query.username, function(success, imageUrl){
      res.send({success: success, imageUrl: imageUrl});
    });
  });

  // Uploads the users profile picture
  api.post('/user/upload_profile_picture', function(req, res){
    console.log('api/user/upload_profile_picture called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    var username = null;
    var token = null;
    var imageFile = null;

    // Set the file path for the image file
    form.on('file', function(field, file){
      if(file.size > 0) imageFile = file.path;
    });

    // Get the username
    form.on('field', function(field, value){
      if(field == 'username') {
        username = value;
      } else if (field == 'token') {
        token = value;
      }
    });

    // Once all of the fields are consumed now we do the real work
    form.on('end', function(){
      // Check to make sure username and imageFile were provided
      if (!token || !username || !imageFile){
        res.send({success: false, message: 'Missing parameters for token, username and/or imageFile'})
      } else {
        var user = require("../modules/user.js");
        user.uploadUserProfilePicture(token, username, imageFile, function(success, message){
          res.send({success: true, message: message});
        });
      }
    });

    // Parse the form to kick off the processing
    form.parse(req);
  });

  // Gets user profiles near the user
  api.get('/search/get_users_near_user', function(req, res){
    console.log('api/search/get_users_near_user');

    var search = require("../modules/search.js");
    search.searchForUsersNearUser(req.query.token, req.query.username, Number(req.query.radius), req.query.useMiles == 'true', function(message, nearbyProfiles){
      res.send({message: message, nearbyProfiles: nearbyProfiles});
    });
  });

  // Gets user profiles near a user input location
  api.get('/search/get_users_near_location', function(req, res){
    console.log('api/search/get_users_near_location');

    var search = require("../modules/search.js");
    search.searchForUsersNearLocation(req.query.token, req.query.username, req.query.location, Number(req.query.radius), req.query.useMiles == 'true', function(message, nearbyProfiles){
      res.send({message: message, nearbyProfiles: nearbyProfiles});
    });
  });

  // Checks if a users profile has been activated
  api.get('/user/has_active_profile', function(req, res){
    console.log('api/user/has_active_profile called');

    var user = require("../modules/user.js");
    user.hasActiveProfile(req.query.token, req.query.username, function(isActive){
      res.send({isActive: isActive});
    });
  });

  // api.get()
  return api;
})();
