// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";

// Checks the user collection to see if a user already exists with the username
exports.checkIfUsernameIsTaken = checkIfUsernameIsTaken = function(username, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.error("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Get the users collection and count
    dbo.collection("users", function(err, coll){
      if(err){
        console.error("Unable to get users collection! Ignore if this is the first user.");
        console.error(err);
        return callback(false);
      } else {
        coll.countDocuments({username: username}, function(err, count){
          if(count > 0){
            return callback(true);
          } else {
            return callback(false);
          }
        });
      }
    });
  });
};

// Checks the user collection to see if a user already exists with the email
exports.checkIfEmailIsTaken = checkIfEmailIsTaken = function(email, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.error("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Get the users collection and count
    dbo.collection("users", function(err, coll){
      if(err){
        console.error("Unable to get users collection! Ignore if this is the first user.");
        console.error(err);
        return callback(false);
      } else {
        coll.countDocuments({email: email}, function(err, count){
          if(count > 0){
            return callback(true);
          } else {
            return callback(false);
          }
        });
      }
    });
  });
}

// Sends the user an email with a link to activate their account
exports.sendUserAccountActivationEmail = sendUserAccountActivationEmail = function(
  emailTo,
  username,
  activationCode,
  send = true,
  preview = false
){
  var email = require('./email.js');

  // Get the url to use for the link from an environment variable
  var appUrl = process.env.VH_APP_URL || 'http://localhost:3000';

  // Set up the inputs for the email template
  templateInputs = {
    appUrl: appUrl,
    username: username,
    activationCode: activationCode
  };

  // Send the email using the template
  email.sendAppTemplateEmail(
    emailTo,
    'account-activation',
    templateInputs,
    send,
    preview
  );
}

// Attempts to create a new user
exports.createUser = function(email, username, password, callback){
  console.log("Creating user for '%s'...", username);

  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.error("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Check username for uniqueness
    checkIfUsernameIsTaken(username, function(usernameTaken){
      var util = require('util');
      if(usernameTaken) {
        console.log("Username '%s' already exists. User will not be created.", username);
        return callback(false, util.format("Username '%s' is already in use. Please select a new one.", username));
      } else {
        // Check email for uniqueness
        checkIfEmailIsTaken(email, function(emailTaken){
          if(emailTaken) {
            console.log("User with email address '%s' already exists. Account will not be created.", email);
            return callback(false, util.format("An account for the email address '%s' already exists.", email));
          } else {
            // Create the account
            var user = {email: email, username: username, creationTime: Date.now()};

            // Hash the  password
            const bcrypt = require('bcrypt');
            user.passwordHash = bcrypt.hashSync(password, 10);

            // Create an activation string
            var crypto = require('crypto');
            user.activationCode = crypto.randomBytes(12).toString('hex');

            // Send activation email
            sendUserAccountActivationEmail(user.email, user.username, user.activationCode);

            // Insert user into user collection
            dbo.collection("users").insertOne(user, function(err, res){
              if (err) {
                  console.error("Error encountered while inserting user '%s', username");
                  console.error(err);
                  return callback(false, "An error occurred while trying to create user.");
              } else {
                console.log("Created user '%s'", username);
                return callback(true, "Your new account has successfully been created.  Please check your email to activate your new account.");
              }
            });

            db.close();
          }
        });
      }
    });
  });
}

// Activates the users account
exports.activateUserAccount = function(username, activationCode, callback){
  console.log("Activating user account for '%s'...", username);

  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.error("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Get the users collection
    searchCriteria = {username: username, activationCode: activationCode};
    dbo.collection("users").findOne(searchCriteria, function(err, result){
      var util = require('util');
      if(!result) {
        console.log("No user found for '%s' with valid activationCode", username);
        return callback(false, util.format("Unable to activate user '%s', user may already be activated.", username));
      } else {
        // Try to update the user to remove activationCode and add activationTime
        newValues = {$set: {activationTime: Date.now()}, $unset: {activationCode: ""}};
        dbo.collection("users").updateOne(searchCriteria, newValues, function(err, result){
          if(err){
            console.error("Error while trying to activate user %s", username);
            console.error(err);
            return callback(false, "A server error occurred while trying to activate user.");
          } else {
            console.log("User '%s' was successfully activated", username);
            return callback(true, "User successfully activated.");
          }
        });
      }
    });
  });
}

// Function to authenticate a user - callback(success, message)
exports.authenticateUser = function(username, password, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();
    var util = require('util');

    // Determine whether to search under username or email
    var usernameOrEmail = "username";
    var searchCriteria = {username: username};
    if(require('email-validator').validate(username)){
      usernameOrEmail = "email";
      searchCriteria = {email: username};
    }

    // Perform the search
    dbo.collection("users").findOne(searchCriteria, function(err, result){
      db.close();
      if(result == null){
        console.log("No user found for %s '%s'", usernameOrEmail, username);
        return callback(false, util.format("No user found for %s '%s'. Please check to make sure you have the correct %s.", usernameOrEmail, username, usernameOrEmail), null);
      } else {
        // Check the password
        const bcrypt = require('bcrypt');
        bcrypt.compare(password, result.passwordHash, function(err, passwordMatch){
            if(passwordMatch){
              // Make sure the user has activated their account
              if(result.activationTime) {
                console.log("User %s authenticated", result.username);
                updateLastLoginTime(result.username);
                return callback(true, null, result.username);
              } else {
                console.log("User '%s' attempted to login with unactived account", result.username);
                return callback(false, util.format("Account '%s' has not yet been activated. Please use the activation link sent to your email to activate the account.", result.username), null);
              }
            }
            else {
              console.log("Wrong password for %s '%s'", usernameOrEmail, username);
              return callback(false, util.format("Incorrect password for %s '%s'. Try again or reset your password, if you have forgotten it.", usernameOrEmail, username), null);
            }
        });
      }
    });
  });
}

// Local function to update the last login time for a user upon login
function updateLastLoginTime(username){
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();
    newValues = {$set: {lastLoginTime: Date.now()} };
    dbo.collection("users").updateOne({username: username}, newValues, function(err, result){
      if(err) throw err;
      console.log("Updated lastLoginTime for '%s'", username);
      db.close();
    });
  });
}

// Requests a password change
exports.requestPasswordReset = function(email, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();
    dbo.collection("users").findOne({email: email}, function(err, result){
      db.close();
      var util = require('util');
      if(result == null){
        console.log("Password reset requested for invalid email address '%s'", email);
        return callback(false, util.format("No account found for '%s'", email));
      } else {
        // Generate the JWT token
        var jwt = require('jsonwebtoken');
        var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';

        // Create the payload
        var payload = { username: result.username, email: result.email, tokenType: 'reset password' };

        // Try to create the token
        jwt.sign(payload, jwtSecret, {expiresIn: "15m"}, function(err, token){
          if(err){
            console.error("Token creation error!");
            console.error(err);
            return callback(false, serverErrorMessage);
          } else {
            // Send the email with the reset link
            sendPasswordResetEmail(email, token);
            return callback(true, "Password reset successfully sent.  Please check your email.");
          }
        });
      }
    });
  });
}

// Sends a template email with a link to reset the password
exports.sendPasswordResetEmail = sendPasswordResetEmail = function(emailTo, token, send = true, preview = false){
  var email = require('./email.js');

  // Get the url to use for the link from an environment variable
  var appUrl = process.env.VH_APP_URL || 'http://localhost:3000';

  // Set up the inputs for the email template
  templateInputs = {
    appUrl: appUrl,
    token: token
  };

  // Send the email using the template
  email.sendAppTemplateEmail(
    emailTo,
    'password-reset',
    templateInputs,
    send,
    preview
  );
}

// Attempts to reset the users password
exports.resetPassword = function(email, newPassword, token, callback){
  // Message to use for all bad token issues
  const badTokenMessage = "Invalid or expired password reset. Please request password reset again.";

  // Check token validity
  var jwt = require('jsonwebtoken');
  var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';
  jwt.verify(token, jwtSecret, function(err, decoded){
    if(err){
      console.log("Invalid password reset token");
      console.log(err);
      return callback(false, badTokenMessage);
    } else {
      // Check to make sure token has the correct payload
      if (!decoded.tokenType || !decoded.email){
        console.error("Password reset token has incorrect payload. Someone is trying to pull something funny here!!!");
        return callback(false, badTokenMessage);
      } else if(decoded.tokenType != 'reset password' || decoded.email != email){
        console.log("Invalid password reset token: tokenType '%s' != 'reset password' or email '%s' != '%s'", decoded.tokenType, decoded.email, email);
        return callback(false, badTokenMessage);
      } else {
        // Connect to the database
        var MongoClient = require('mongodb').MongoClient;
        var mongoURI = process.env.MONGOLAB_URI;
        MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
          // Throw error if unable to connect
          if(err){
            console.log("Unable to connect to MongoDB!!!");
            throw err;
          }
          var dbo = db.db();

          // Update the users record with a new passwordHash
          const bcrypt = require('bcrypt');
          newValues = {$set: {passwordHash: bcrypt.hashSync(newPassword, 10)} };
          dbo.collection("users").updateOne({email: decoded.email}, newValues, function(err, result){
            db.close();
            if(err){
              console.error("Unable to reset users password");
              console.error(err);
              return callback(false, serverErrorMessage);
            } else {
              console.log("Succesfully reset users password");
              // Send a confirmation email to the user
              sendPasswordResetConfirmationEmail(decoded.email);
              return callback(true, "Your password has successfully been reset.");
            }
          });
        });
      }
    }
  });
}

// Sends a template email to confirm that the users password has been reset
exports.sendPasswordResetConfirmationEmail = sendPasswordResetConfirmationEmail = function(emailTo, send = true, preview = false){
  var email = require('./email.js');

  // Set up the inputs for the email template
  templateInputs = {
    email: emailTo
  };

  // Send the email using the template
  email.sendAppTemplateEmail(
    emailTo,
    'password-change-confirm',
    templateInputs,
    send,
    preview
  );
}

// Attempts to change the users password
exports.changePassword = function(username, oldPassword, newPassword, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Find the user record to verify the old password
    dbo.collection("users").findOne({username: username}, function(err, user){
      if(err){
        console.error("Error occurred while tring to get '%s' user for password reset", username);
        console.error(err);
        return callback(false, serverErrorMessage);
      } else if (user == null){
        console.error("Unable to find '%s' user record for password reset", username);
        return callback(false, serverErrorMessage);
      } else {
        // Test old password first
        const bcrypt = require('bcrypt');
        bcrypt.compare(oldPassword, user.passwordHash, function(err, passwordMatch){
          if(!passwordMatch){
            console.log("User '%s' entered incorrect old password.");
            return callback(false, "Incorrect old password.");
          } else {
            // Update the password
            newValues = {$set: {passwordHash: bcrypt.hashSync(newPassword, 10)} };
            dbo.collection("users").updateOne({username: username}, newValues, function(err, result){
              db.close();
              if(err){
                console.error("Unable to reset users password");
                console.error(err);
                return callback(false, serverErrorMessage);
              } else {
                console.log("Succesfully reset users password");
                // Send a confirmation email to the user
                sendPasswordResetConfirmationEmail(user.email);
                return callback(true, "Your password has successfully been changed.");
              }
            });
          }
        });
      }
    });
  });
}

// Gets a users profile if one exists
exports.getUserProfile = getUserProfile = function(username, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Perform the search
    dbo.collection("userProfiles").findOne({username: username}, function(err, profile){
      db.close();
      if(err){
        // If there is an error throw so we don't end up inserting duplicates
        console.error("Error occurred while trying to get profile for '%s'", username);
        console.error(err);
        throw err;
      } else if (profile == null) {
        console.log("No profile found for user '%s'", username);
        return callback(false, null);
      } else {
        console.log("Profile found for user '%s'", username);
        return callback(true, profile);
      }
    });
  });
}

// Inserts a new profile for a user
insertUserProfile = function(
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  callback
){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Create profile object
    profile = {
      username: username,
      displayName: displayName,
      aboutMe: aboutMe,
      lookingToMeet: lookingToMeet
    };

    // Determine whether profile should be considered activate
    profile.active = userProfileShouldBeActive(profile);

    // Insert the record
    dbo.collection("userProfiles").insertOne(profile, function(err, res){
      db.close();
      if(err){
        console.error("Error encountered while inserting user profile for '%s'", username);
        console.error(err);
        return callback(false, serverErrorMessage);
      } else {
        console.log("Succesfully inserted user profile for '%s'", username);
        // #TODO: Add to message something about whether the profile is active or not
        return callback(true, "Your profile has successfully been created.");
      }
    });
  });
}

// Check if a profile should be considered active i.e. searchable by other users
userProfileShouldBeActive = function(profile){
  // #TODO: This will be turned on based on all required fields having values
  return false;
}

// Updates a users profile
updateUserProfile = function(
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  callback
){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Throw error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      throw err;
    }
    var dbo = db.db();

    // Create profile object
    profile = {
      username: username,
      displayName: displayName,
      aboutMe: aboutMe,
      lookingToMeet: lookingToMeet
    };

    // Determine whether profile should be considered activate
    profile.active = userProfileShouldBeActive(profile);

    // Update the profile to the input values
    dbo.collection("userProfiles").updateOne({username: username}, {$set: profile}, function(err, result){
      if(err){
        console.error("Error encountered while trying to update user profile for '%s'", username);
        console.error(err);
        return callback(false, serverErrorMessage);
      } else {
        console.log("Succesfully updated user profile for '%s'", username);
        // #TODO: Add to message about whether profile is active or not
        return callback(true, "Succesfully updated your profile.");
      }
    });
  });
}

// Inserts or updates a users profile
exports.saveUserProfile = saveUserProfile = function(
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  callback
){
  // Try to get the user profile
  getUserProfile(username, function(profileFound, profile){
    if(profileFound){
      // Call update method if it exists
      updateUserProfile(
        username,
        displayName,
        aboutMe,
        lookingToMeet,
        function(success, message){
        return callback(success, message);
      });
    } else {
      // Call insert method if not
      insertUserProfile(
        username,
        displayName,
        aboutMe,
        lookingToMeet,
        function(success, message){
        return callback(success, message);
      });
    }
  });
}
