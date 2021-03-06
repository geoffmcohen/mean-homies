// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";

// Code to create a JWT token to return to the client
createToken = function(username, userType, tokenExpiry, callback){
  var jwt = require('jsonwebtoken');
  var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';

  // Create the payload
  var payload = { username: username, userType: userType };

  // Try to create the token
  jwt.sign(payload, jwtSecret, {expiresIn: tokenExpiry}, function(err, token){
    if(err){
      console.error("Token creation error!");
      console.error(err);
      return callback(err, null);
    } else {
      return callback(null, token);
    }
  });
}

// Calls the login function for a user or admin user - callback returns token and message
exports.login = function(username, password, userType, callback){
  if(userType == 'admin') {
    var admin = require('./admin.js');
    admin.authenticateAdminUser(username, password, function(err, authResult){
      if(authResult){
        // Create the token
        createToken(username, userType, '6h', function(err, token){
            if(err) {
              return callback(null, serverErrorMessage, null);
            } else {
              return callback(token, "Login successful", username);
            }
        });
      } else {
        // #TODO: Make this more accurate so we can display better messages
        return callback(null, "Wrong username/password combination");
      }
    });
  } else if (userType == 'user') {
    var user = require('./user.js');
    user.authenticateUser(username, password, function(authResult, message, actualUsername){
      if(authResult){
        // Create the token
        createToken(actualUsername, userType, '24h', function(err, token){
          if(err) {
            return callback(null, serverErrorMessage, null);
          } else {
            return callback(token, "Login successful", actualUsername);
          }
        });
      } else {
        return callback(null, message, null);
      };
    });
  }
  else {
    console.error("Wrong userType input '%s' to auth.login()", userType);
    return callback(null, serverErrorMessage, null);
  }
}

// Checks the user token
exports.verifyUser = function(token, username, userType, callback){
  var jwt = require('jsonwebtoken');
  var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';
  jwt.verify(token, jwtSecret, function(err, decoded){
    if(err){
      return callback(err, false);
    } else {
      // Ensure username and userType match token data if provided
      if(username && decoded.username != username) {
        return callback(new Error('Wrong user for token'), false);
      } else if (userType && decoded.userType != userType) {
        callback(new Error('Wrong userType for token'), false);
      } else {
        if(userType == 'admin' || !username){
          return callback(null, true);
        } else {
          // Now check if user is currently banned
          require('./user.js').checkIfUserIsBanned(username, function(success, isBanned){
            if(!success) {
              return callback(new Error("Unable to determine if user is banned"), false);
            } else if(isBanned){
              return callback(new Error("User is banned and is not allowed to call the API"), false);
            } else {
              return callback(null, true);
            }
          });
        }
      }
    }
  });
};
