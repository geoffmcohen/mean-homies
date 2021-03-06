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

    // Get the input if provided in the HTTP request
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var postsPerPage = req.query.posts_per_page ? parseInt(req.query.posts_per_page) : 5;

    // Call the blog module to get the results
    require("../modules/blog.js").getBlogPosts(page, postsPerPage, function(success, blogResults){
      res.send({success: success, blogResults: blogResults});
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
        require('../modules/page-stats.js').incrementPageCount(fields.pageName, function(err, result){});
      };
    });
  });

  // Records page stats
  api.post('/record_page_stats', function(req, res){
    console.log('api/record_page_stats called');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      require('../modules/page-stats.js').recordPageStats(fields.pageName, fields.username, fields.isMobile == 'true');
    });
  });

  // Gets the page Counts
  api.get('/admin/get_page_counts', function(req, res){
    console.log('api/admin/get_page_counts called');

    var pageCounter = require('../modules/page-stats.js');
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
    user.getUserProfile(req.query.token, req.query.username, req.query.targetUser, function(success, profile){
      res.send({success: success, profile: profile});
    });
  });

  // Get a multiple user profiles
  api.get('/user/get_profiles', function(req, res){
    console.log('api/user/get_profiles called');

    var user = require("../modules/user.js");
    user.getUserProfiles(req.query.token, req.query.username, req.query.usersString.split(','), function(success, profilesByUsername){
      res.send({success: success, profilesByUsername: profilesByUsername});
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
        function(success, message, isActive){
        res.send({success: success, message: message, isActive: isActive});
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

  // Gets the users preferences
  api.get('/user/get_user_preferences', function(req, res){
    console.log('api/user/get_user_preferences');

    var user = require("../modules/user.js");
    user.getUserPreferences(req.query.token, req.query.username, function(success, preferences){
      res.send({success: success, preferences: preferences});
    });
  });

  // Saves the users preferences
  api.post('/user/save_user_preferences', function(req, res){
    console.log('api/user/save_user_preferences');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var user = require("../modules/user.js");
      user.saveUserPreferences(
        fields.token,
        fields.username,
        fields.sendAnnouncementsEmail == 'true',
        fields.sendNewMessageEmail == 'true',
        fields.sendHomieRequestReceiveEmail == 'true',
        fields.sendHomieRequestAcceptEmail == 'true',
        function(success, message){
          res.send({success: success, message: message});
        }
      );
    });
  });

  // Returns the relationship between two users
  api.get('/homies/get_homie_status', function(req, res){
    console.log('api/homies/get_homie_status');

    var homies = require("../modules/homies.js");
    homies.getHomieStatus(req.query.token, req.query.username, req.query.targetUser, function(success, status){
      res.send({success: success, status: status});
    });
  });

  // Sends a Homie request to the target user
  api.post('/homies/send_homie_request', function(req, res){
    console.log('api/homies/send_homie_request');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.sendHomieRequest(fields.token, fields.username, fields.targetUser, fields.message, function(success, msg){
        res.send({success: success, message: msg});
      });
    });
  });

  // Accepts a Homie request from the target user
  api.post('/homies/accept_homie_request', function(req, res){
    console.log('api/homies/accept_homie_request');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.acceptHomieRequest(fields.token, fields.username, fields.targetUser, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Declines a Homie request from the target user
  api.post('/homies/decline_homie_request', function(req, res){
    console.log('api/homies/decline_homie_request');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.declineHomieRequest(fields.token, fields.username, fields.targetUser, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Gets the users homies
  api.get('/homies/get_users_homies', function(req, res){
    console.log('api/homies/get_users_homies');

    var homies = require("../modules/homies.js");
    homies.getUsersHomies(req.query.token, req.query.username, function(success, homies){
      res.send({success: success, homies: homies});
    });
  });

  // Gets the pending  and waiting homie requests for a user
  api.get('/homies/get_users_homie_requests', function(req, res){
    console.log('api/homies/get_users_homie_requests');

    var homies = require("../modules/homies.js");
    homies.getUsersHomieRequests(req.query.token, req.query.username,function(success, homieRequests){
      res.send({success: success, homieRequests: homieRequests});
    });
  });

  // Deletes a Homie request sent from the user to the target user
  api.post('/homies/delete_homie_request', function(req, res){
    console.log('api/homies/delete_homie_request');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.deleteHomieRequest(fields.token, fields.username, fields.targetUser, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Removes the target user from the users homie list
  api.post('/homies/remove_homie', function(req, res){
    console.log('api/homies/remove_homie');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.removeUsersHomie(fields.token, fields.username, fields.targetUser, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Blocks a the target user from contacting this user
  api.post('/homies/block_user', function(req, res){
    console.log('api/homies/block_user');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the homie request
      var homies = require("../modules/homies.js");
      homies.blockUser(fields.token, fields.username, fields.targetUser, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Sends a new message from the user to the target user
  api.post('/messages/send_message', function(req, res){
    console.log('api/messages/send_message');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the message
      var msg = require("../modules/messages.js");
      msg.sendMessage(fields.token, fields.username, fields.targetUser, fields.messageText, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // Gets the messages between the user and the target user
  api.get('/messages/get_messages', function(req, res){
    console.log('api/messages/get_messages');

    var msg = require("../modules/messages.js");
    msg.getMessages(req.query.token, req.query.username, req.query.targetUser, Number(req.query.startTime), function(success, messages){
      res.send({success: success, messages: messages});
    });
  });

  // Gets the count of unread message for the user
  api.get('/messages/get_unread_message_count', function(req, res){
    console.log('api/messages/get_unread_message_count');

    var msg = require("../modules/messages.js");
    msg.getUnreadMessageCount(req.query.token, req.query.username, function(success, count){
      res.send({success: success, count: count});
    });
  });

  // Gets the latest messages in all user conversations
  api.get('/messages/get_latest_messages', function(req, res){
    console.log('api/messages/get_latest_messages');

    var msg = require("../modules/messages.js");
    msg.getLatestMessages(req.query.token, req.query.username, function(success, messages){
      res.send({success: success, messages: messages});
    });
  });

  // Gets a specific message
  api.get('/messages/get_message', function(req, res){
    console.log('api/messages/get_message');

    var msg = require("../modules/messages.js");
    msg.getMessage(req.query.token, req.query.username, req.query.sendUser, req.query.receiveUser, Number(req.query.sendTimestamp), req.query.markAsRead == 'true', function(success, messages){
      res.send({success: success, message: message});
    });
  });

  // Bans a user
  api.post('/admin/create_user_ban', function(req, res){
    console.log('api/admin/create_user_ban');

    // Get the parameters from the request
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      // Send the message
      var user = require("../modules/user.js");
      user.banUser(fields.adminToken, fields.adminUser, fields.targetUser, fields.banType, fields.banPeriod, fields.banPeriodUnit, fields.banComment, function(success, message){
        res.send({success: success, message: message});
      });
    });
  });

  // api.get()
  return api;
})();
