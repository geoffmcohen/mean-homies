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
              return callback(null, serverErrorMessage);
            } else {
              return callback(token, "Login successful");
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
            return callback(null, serverErrorMessage);
          } else {
            return callback(token, "Login successful");
          }
        });
      } else {
        return callback(null, message);
      };
    });
  }
  else {
    console.error("Wrong userType input '%s' to auth.login()", userType);
    return callback(null, serverErrorMessage);
  }
}

// Checks the user token
exports.verifyUser = function(token, username, userType, callback){
  var jwt = require('jsonwebtoken');
  var jwtSecret = process.env.JWT_SECRET || 'superdupersecret';
  jwt.verify(token, jwtSecret, function(err, decoded){
    if(err){
      callback(err, false);
    } else {
      // Ensure username and userType match token data
      if(decoded.username != username) {
        callback(new Error('Wrong user for token'), false);
      } else if (decoded.userType != userType) {
        callback(new Error('Wrong userType for token'), false);
      } else {
        callback(null, true);
      }
    }
  });
};
