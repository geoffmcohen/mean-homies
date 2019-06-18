// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";
const invalidTokenMessage = "Invalid user token provided. Please log out and back in and try again.";

// Returns the relationship between two users
exports.getHomieStatus = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call the function to get the status
      exports.getStatus(username, targetUser, function(success, status){
        return callback(success, status);
      });
    }
  });
}

// Function to get the status between two users - possible values:
//   blocked - One of the two users has blocked the other
//   homies - The two users are indeed homies
//   waiting - Waiting for targetUser to accept
//   pending - Waiting for username to accept`
//   n/a - No relationship exists between the users
exports.getStatus = function(username, targetUser, callback){
  console.log("Getting homie status between '%s' and '%s'", username, targetUser);

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
    // Check if one user blocked the other
    searchCriteria = {$or: [
      {username: username, blockedUser: targetUser},
      {username: targetUser, blockedUser: username}
    ]};
    dbo.collection("userBlocks").findOne(searchCriteria, function(err, blockRecord){
      if(err){
        console.error("Error occurred while checking userBlocks");
        console.error(err);
        return callback(false, null);
      } else if(blockRecord){
        console.log("User '%s' has blocked '%s'", blockRecord.username, blockRecord.blockedUser);
        return callback(true, 'blocked');
      } else {
        // Now check if the users are homies
        searchCriteria = {$or: [
          {requestUser: username, acceptUser: targetUser},
          {requestUser: targetUser, acceptUser: username}
        ]};
        dbo.collection("homies").findOne(searchCriteria, function(err, homiesRecord){
          if(err){
            console.error("Error occurred while checking homies");
            console.error(err);
            return callback(false, null);
          } else if (homiesRecord){
            console.log("User '%s' and '%s' are homies", username, targetUser);
            return callback(true, 'homies');
          } else {
            // Finally check if one user has homie requested the other users
            searchCriteria = {$or: [
              {requestUser: username, acceptUser: targetUser},
              {requestUser: targetUser, acceptUser: username}
            ]};
            dbo.collection("homieRequests").findOne(searchCriteria, function(err, requestRecord){
              db.close();
              if(err){
                console.error("Error occurred while checking homieRequests");
                console.error(err);
                return callback(false, null)
              } else if (requestRecord){
                  // Now check who requested who
                  if(requestRecord.requestUser == username){
                    console.log("User '%s' is waiting for '%s' to accept homie request", username, targetUser);
                    return callback(true, 'waiting');
                  } else {
                    console.log("User '%s' can accept request from '%s'", username, targetUser);
                    return callback(true, 'pending');
                  }
              } else {
                // Otherwise return a n/a status indicating no relationship between users
                console.log("No relationship found between '%s' and '%s's", username, targetUser);
                return callback(true, 'n/a');
              }
            });
          }
        });
      }
    });
  });
}

// Sends a Homie request to the target user
exports.sendHomieRequest = function(token, username, targetUser, message, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call function to actually make the request
      exports.sendRequest(username, targetUser, message, function(success, msg){
        return callback(success, msg);
      });
    }
  });
}

// Creates the actual homie request between two users
exports.sendRequest = function(username, targetUser, message, callback){
  console.log("Sending Homie Request '%s' >>> '%s'", username, targetUser);

  // Get the status between the users
  exports.getStatus(username, targetUser, function(success, status){
      if(!success){
        return callback(false, serverErrorMessage);
      } else if(status != 'n/a'){
        // #TODO: Make more situational messages here
        return callback(false, "Unable to make a new Homie Request due to current status.");
      } else {
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

          // Create the request record
          homieRequest = {
            requestUser: username,
            acceptUser: targetUser,
            message: message,
            requestTime: Date.now()
          };
          dbo.collection("homieRequests").insertOne(homieRequest, function(err, result){
            db.close();
            if(err){
              console.error("Unable to insert homieRequest");
              console.error(err);
              return callback(false, serverErrorMessage);
            } else {
              console.log("Succesfully inserted homieRequest");
              // #TODO: Send an email to the target user
              return callback(true, "Succesfully created Homie Request");
            }
          });
        });
      }
  });
}

// Accepts a Homie request from the target user
exports.acceptHomieRequest = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call the actual function to make the request
      exports.acceptRequest(username, targetUser, function(success, message){
        return callback(success, message);
      });
    }
  });
}

// Function to allow users to accept friend requests
exports.acceptRequest = function(username, targetUser, callback){
  console.log("Accepting Homie Request '%s' >>> '%s'", targetUser, username);

  // Get the status between the users
  exports.getStatus(username, targetUser, function(success, status){
    if(!success){
      return callback(false, serverErrorMessage);
    } else if(status != 'pending'){
      // #TODO: Make more situational messages here
      return callback(false, "Unable to accept Homie Request due to current status.");
    } else {
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

        // Find the homieRequest
        searchCriteria = {requestUser: targetUser, acceptUser: username};
        dbo.collection("homieRequests").findOne(searchCriteria, function(err, homieRequest){
          if (!homieRequest)
          {
            console.log("Unable to find homieRequest between '%s' and '%s'", targetUser, username);
            return callback(false, serverErrorMessage);
          } else {
            // Create the record to insert into homies
            homieRecord = homieRequest;
            homieRecord.acceptTime = Date.now();
            homieRecord.requestMessage = homieRecord.message;
            delete homieRecord.message;

            // Insert into homies
            dbo.collection("homies").insertOne(homieRecord, function(err, insertResult){
              if(err){
                console.error("Unable to insert into homies");
                console.error(err);
                return callback(false, serverErrorMessage);
              } else {
                // Remove from homieRequest
                dbo.collection("homieRequests").deleteOne(searchCriteria, function(err, deleteResult){
                  db.close();
                  if(err){
                    console.error("Unable to remove from homieRequests");
                    console.error(err);
                    return callback(false, serverErrorMessage);
                  } else {
                    console.log("Succesfully accepted homie request '%s' >>> '%s'", targetUser, username);
                    return callback(true, "Succesfully accepted Homie Request");
                  };
                });
              }
            });
          }
        });
      });
    };
  });
}

// Declines a Homie request from the target user
exports.declineHomieRequest = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call the actual function to make the request
      exports.declineRequest(username, targetUser, function(success, message){
        return callback(success, message);
      });
    }
  });
}

// Function to allow users to decline friend requests
exports.declineRequest = function(username, targetUser, callback){
  console.log("Declining Homie Request '%s' >>> '%s'", targetUser, username);

  // Get the status between the users
  exports.getStatus(username, targetUser, function(success, status){
    if(!success){
      return callback(false, serverErrorMessage);
    } else if(status != 'pending'){
      // #TODO: Make more situational messages here
      return callback(false, "Unable to decline Homie Request due to current status.");
    } else {
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

        // Find the homieRequest
        searchCriteria = {requestUser: targetUser, acceptUser: username};
        dbo.collection("homieRequests").findOne(searchCriteria, function(err, homieRequest){
          if (!homieRequest)
          {
            console.log("Unable to find homieRequest between '%s' and '%s'", targetUser, username);
            return callback(false, serverErrorMessage);
          } else {
            // Create the record to insert into homies
            homieRequest.declineTime = Date.now();

            // Insert into homies
            dbo.collection("declinedHomieRequests").insertOne(homieRequest, function(err, insertResult){
              if(err){
                console.error("Unable to insert into declinedHomieRequests");
                console.error(err);
                return callback(false, serverErrorMessage);
              } else {
                // Remove from homieRequest
                dbo.collection("homieRequests").deleteOne(searchCriteria, function(err, deleteResult){
                  db.close();
                  if(err){
                    console.error("Unable to remove from homieRequests");
                    console.error(err);
                    return callback(false, serverErrorMessage);
                  } else {
                    console.log("Succesfully declined homie request '%s' >>> '%s'", targetUser, username);
                    return callback(true, "Succesfully declined Homie Request");
                  };
                });
              }
            });
          }
        });
      });
    };
  });
}

// Gets the users homies
exports.getUsersHomies = function(token, username, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      // Call the function to get the homies for the user
      exports.getHomies(username, function(success, homies){
        return callback(true, homies);
      });
    }
  });
}

// Finds all of the hommies for an input user
// #TODO: Remove any blocked users
exports.getHomies = function(username, callback){
  console.log("Finding homies for '%s'", username);

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

    // Find all of a users homies
    searchCriteria = {$or: [ {requestUser: username}, {acceptUser: username} ]};
    dbo.collection("homies").find(searchCriteria, function(err, homiesRecords){
      if(err){
        console.error("An error occurred getting homies for '%s'", username);
        console.error(err);
        return callback(false, null);
      } else {
        var homies = [];
        // Loop through the records adding each homie to the array to return
        homiesRecords.forEach(function(homieRecord){
          if(homieRecord.requestUser == username){
            homies.push(homieRecord.acceptUser);
          } else {
            homies.push(homieRecord.requestUser);
          }
        }, function(err){
          db.close();
          if(err){
            console.error("Error occurred while tying to loop through homies for '%s'", username);
            console.error(err);
            return callback(false, null);
          } else {
            // Sort the homies in alphabetical order
            homies.sort(function(a, b){return a > b});

            // Callback with the results
            return callback(true, homies);
          }
        });
      }
    });
  });
}

// Gets the pending  and waiting homie requests for a user
exports.getUsersHomieRequests = function(token, username, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      // Call the function to get the homies requests for the user
      exports.getHomieRequests(username, function(success, homieRequests){
        return callback(true, homieRequests);
      });
    }
  });
}

// Gets pending homie requests for the user, split by 'pending' and 'waiting'
exports.getHomieRequests = function(username, callback){
  console.log("Getting homieRequests for '%s'", username);

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

    // Find all of a users homies
    searchCriteria = {$or: [ {requestUser: username}, {acceptUser: username} ]};
    dbo.collection("homieRequests").find(searchCriteria, function(err, homieRequests){
      if(err){
        console.error("An error occurred getting homies for '%s'", username);
        console.error(err);
        return callback(false, null);
      } else {
        // Create a json with two arrays to split the results by who made the request
        var retVal = {pending: [], waiting: []};
        homieRequests.forEach(function(homieRequest){
          if(homieRequest.requestUser == username){
            retVal.waiting.push(homieRequest);
          } else {
            retVal.pending.push(homieRequest);
          }
        }, function(err){
          if(err){
            console.error("Unable to get homie requests for '%s'", username);
            console.error(err);
            return callback(false, null);
          } else {
            db.close();
            // Sort both arrays by the other users name
            retVal.pending.sort(function(a, b){return a.requestUser > b.requestUser});
            retVal.waiting.sort(function(a, b){return a.acceptUser > b.acceptUser});

            console.log("Found %d pending and %d waiting homieRequests for '%s'", retVal.pending.length, retVal.waiting.length, username);
            return callback(true, retVal);
          }
        });
      }
    });
  });
}
