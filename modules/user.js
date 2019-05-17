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
// #TODO: Need to actually create the email code
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
// #TODO: Validate user password requirements - can be done in frontend
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
        return callback(false, util.format("Username '%s' is already in use. Please select an new one.", username));
      } else {
        // Check email for uniqueness
        checkIfEmailIsTaken(email, function(emailTaken){
          if(emailTaken) {
            console.log("User with email address '%s' already exists. User will not be created.", email);
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
                return callback(true, util.format("User '%s' successfully created", username));
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
