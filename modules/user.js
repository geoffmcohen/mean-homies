// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";
const invalidTokenMessage = "Invalid user token provided. Please log out and back in and try again.";

// Checks the user collection to see if a user already exists with the username
exports.checkIfUsernameIsTaken = checkIfUsernameIsTaken = function(username, callback){
  // Force username to be lowercase
  username = username.toLowerCase();

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
  // Force email to be lowercase
  email = email.toLowerCase();

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
  // Force email and username to be lowercase
  email = email.toLowerCase();
  username = username.toLowerCase();

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
  // Force username to be lowercase
  username = username.toLowerCase();

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
  // Force email to be lowercase
  email = email.toLowerCase();

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
  // Force email to be lowercase
  email = email.toLowerCase();

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
exports.getUserProfile = function(token, username, targetUser, callback){
  // Force username to be lowercase
  username = username.toLowerCase();

  // Check to make sure a user token is valid
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      exports.getUserProfileNoToken(username, targetUser, function(err, profile){
        return callback(err, profile);
      });
    }
  });
}

// Retreives the profile if it isn't blocked
exports.getUserProfileNoToken = function(username, targetUser, callback){
  require('./homies.js').getHomieStatusNoToken(username, targetUser, function(success, homieStatus){
    //  Don't allow a user to be able to get the profile of a user that has blocked them or that they have blocked
    if(homieStatus == 'blocked'){
      console.warn("User '%s' attempted to get the profile of blocked user '%s'", username, targetUser);
      return callback(false, null);
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

        // Perform the search
        dbo.collection("userProfiles").findOne({username: targetUser}, function(err, profile){
          db.close();
          if(err){
            // If there is an error throw so we don't end up inserting duplicates
            console.error("Error occurred while trying to get profile for '%s'", targetUser);
            console.error(err);
            throw err;
          } else if (profile == null) {
            console.log("No profile found for user '%s'", targetUser);
            return callback(false, null);
          } else {
            console.log("Profile found for user '%s'", targetUser);
            return callback(true, profile);
          }
        });
      });
    }
  });
}

// Inserts a new profile for a user
insertUserProfile = function(
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  location,
  lat,
  lng,
  city,
  stateProvince,
  country,
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
      lookingToMeet: lookingToMeet,
    };

    // Add location information if it was provided
    if(location){
      profile.location = {
        locationEntered: location,
        lat: lat,
        lng: lng,
        city: city,
        stateProvince: stateProvince,
        country: country
      }
    }

    // Determine whether profile should be considered activate
    profile.active = userProfileShouldBeActive(profile);

    // Insert the record
    dbo.collection("userProfiles").insertOne(profile, function(err, res){
      db.close();
      if(err){
        console.error("Error encountered while inserting user profile for '%s'", username);
        console.error(err);
        return callback(false, serverErrorMessage, false);
      } else {
        console.log("Succesfully inserted user profile for '%s'", username);
        if(profile.active){
          return callback(true, "Your profile has successfully been created and is now active.", profile.active);
        } else {
          return callback(true, "Your profile has successfully been created, but is not yet active. To activate, please enter data into all required fields.", profile.active);
        }
      }
    });
  });
}

// Check if a profile should be considered active i.e. searchable by other users
userProfileShouldBeActive = function(profile){
  if(profile.location && profile.aboutMe && profile.lookingToMeet){
    return true;
  } else {
    return false;
  }
}

// Updates a users profile
updateUserProfile = function(
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  location,
  lat,
  lng,
  city,
  stateProvince,
  country,
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

    // Add location information if it was provided
    if(location){
      profile.location = {
        locationEntered: location,
        lat: lat,
        lng: lng,
        city: city,
        stateProvince: stateProvince,
        country: country
      }
    }

    // Determine whether profile should be considered activate
    profile.active = userProfileShouldBeActive(profile);

    // Update the profile to the input values
    dbo.collection("userProfiles").updateOne({username: username}, {$set: profile}, function(err, result){
      if(err){
        console.error("Error encountered while trying to update user profile for '%s'", username);
        console.error(err);
        return callback(false, serverErrorMessage, false);
      } else {
        console.log("Succesfully updated user profile for '%s'", username);
        if(profile.active){
          return callback(true, "Your profile has successfully updated and is now active.", profile.active);
        } else {
          return callback(true, "Your profile has successfully been updated, but is not yet active. To activate, please enter data into all required fields.", profile.active);
        }
      }
    });
  });
}

// Inserts or updates a users profile
exports.saveUserProfile = saveUserProfile = function(
  token,
  username,
  displayName,
  aboutMe,
  lookingToMeet,
  location,
  lat,
  lng,
  city,
  stateProvince,
  country,
  callback
){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Try to get the user profile
      exports.getUserProfileNoToken(username, username, function(profileFound, profile){
        if(profileFound){
          // Call update method if it exists
          updateUserProfile(
            username,
            displayName,
            aboutMe,
            lookingToMeet,
            location,
            lat,
            lng,
            city,
            stateProvince,
            country,
            function(success, message, isActive){
            return callback(success, message, isActive);
          });
        } else {
          // Call insert method if not
          insertUserProfile(
            username,
            displayName,
            aboutMe,
            lookingToMeet,
            location,
            lat,
            lng,
            city,
            stateProvince,
            country,
            function(success, message, isActive){
            return callback(success, message, isActive);
          });
        }
      });
    }
  });
}

// Uploads an image file and sets it as the users image
exports.uploadUserProfilePicture = function(token, username, imageFile, callback){
  console.log("Uploading new profile image for '%s'...", username);

  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Upload the new user image to cloudinary
      var cloudinary = require('cloudinary');
      cloudinary.v2.uploader.upload(imageFile, {folder: "user/" + username}, function(err, uploadResult){
        if(err){
          console.error("User profile image failed to upload to cloudinary");
          console.error(err);
          return callback(false, serverErrorMessage);
        } else {
          console.log("User profile picture uploaded to '%s'", uploadResult.url);

          // Update or insert the users profile image url to the database depending on whether user has one already
          getUserProfilePicture(token, username, function(imageFound, oldImageUrl){
            if(imageFound){
              updateUserProfilePicture(username, oldImageUrl, uploadResult.url, function(success, message){
                return callback(success, message);
              });
            } else {
              insertUserProfilePicture(username, uploadResult.url, function(success, message){
                return callback(success, message);
              });
            }
          });
        }
      });
    }
  });
}

// Gets a users profile image
exports.getUserProfilePicture = getUserProfilePicture = function(token, username, callback){
  console.log("Retrieving profile image for '%s'...", username);

  // Check to make sure a user token is valid
  require('./auth.js').verifyUser(token, null, null, function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
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

        // Perform the search
        dbo.collection("userImages").findOne({username: username}, function(err, record){
          db.close();
          if(err){
            // If there is an error throw so we don't end up inserting duplicates
            console.error("Error occurred while trying to get profile picture  for '%s'", username);
            console.error(err);
            throw err;
          } else if (record == null) {
            console.log("No profile picture found for user '%s'", username);
            return callback(false, null);
          } else {
            console.log("Profile picture found for user '%s'", username);
            return callback(true, record.imageUrl);
          }
        });
      });
    }
  });
}

// Updates the users profile image url and removes old image from cloudinary
updateUserProfilePicture = function(username, oldImageUrl, newImageUrl, callback){
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
    dbo.collection("userImages").updateOne({username: username}, {$set: {imageUrl: newImageUrl}}, function(err, updateResult){
      db.close();
      if(err){
        console.error("Error occurred while trying to update user profile picture for '%s'", username);
        console.error(err);
        return callback(false, serverErrorMessage);
      } else {
        // Remove old image from cloudinary
        var cloudinary = require('cloudinary');
        cloudinary.v2.uploader.destroy(oldImageUrl, function(err, destroyResult){
          if(err){
            console.error("Unable to delete user image '%s'", oldImageUrl);
            console.erorr(err);
          } else {
            console.log("Succesfully deleted user image '%s'", oldImageUrl);
          }
        });

        console.log("Succesfully uploaded new profile picture for '%s'", username);
        return callback(true, "Your profile picture has been successfully upldated.");
      }
    });
  });

}

// Inserts the users profile image url
insertUserProfilePicture = function(username, imageUrl, callback){
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
    dbo.collection("userImages").insertOne({username: username, imageUrl: imageUrl}, function(err, insertResult){
      db.close();
      if(err){
        console.error("Unable to insert user profile image '%s'", imageUrl);
        console.error(err);
        return callback(false, serverErrorMessage);
      } else {
        console.log("Succesfully inserted user profile image for user '%s'", username);
        return callback(true, "Your profile picture has been successfully uploaded.");
      }
    });
  });
}

// Checks if users profile is active
exports.hasActiveProfile = function(token, username, callback){
  exports.getUserProfile(token, username, function(success, profile){
    if(!success){
      return callback(false);
    } else {
      return callback(profile.active);
    }
  });
}
