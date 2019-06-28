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
      exports.getHomieStatusNoToken(username, targetUser, function(success, status){
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
exports.getHomieStatusNoToken = function(username, targetUser, callback){
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
        db.close();
        console.error("Error occurred while checking userBlocks");
        console.error(err);
        return callback(false, null);
      } else if(blockRecord){
        db.close();
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
            db.close();
            console.error("Error occurred while checking homies");
            console.error(err);
            return callback(false, null);
          } else if (homiesRecord){
            db.close();
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
      exports.sendHomieRequestNoToken(username, targetUser, message, function(success, msg){
        // Notify the targetUser in real time of request
        require('./real-time.js').emitEvent('homie request count change', {requestUser: username, acceptUser: targetUser});

        // Callback with success
        return callback(success, msg);
      });
    }
  });
}

// Creates the actual homie request between two users
exports.sendHomieRequestNoToken = function(username, targetUser, message, callback){
  console.log("Sending Homie Request '%s' >>> '%s'", username, targetUser);

  // Get the status between the users
  exports.getHomieStatusNoToken(username, targetUser, function(success, status){
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
      exports.acceptHomieRequestNoToken(username, targetUser, function(success, message){
        // Notify the users client that the count has changed
        require('./real-time.js').emitEvent('homie request count change', {requestUser: targetUser, acceptUser: username});
        return callback(success, message);
      });
    }
  });
}

// Function to allow users to accept friend requests
exports.acceptHomieRequestNoToken = function(username, targetUser, callback){
  console.log("Accepting Homie Request '%s' >>> '%s'", targetUser, username);

  // Get the status between the users
  exports.getHomieStatusNoToken(username, targetUser, function(success, status){
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
      exports.declineHomieRequestNoToken(username, targetUser, function(success, message){
        // Notify the users client that the count has changed
        require('./real-time.js').emitEvent('homie request count change', {requestUser: targetUser, acceptUser: username});
        return callback(success, message);
      });
    }
  });
}

// Function to allow users to decline friend requests
exports.declineHomieRequestNoToken = function(username, targetUser, callback){
  console.log("Declining Homie Request '%s' >>> '%s'", targetUser, username);

  // Get the status between the users
  exports.getHomieStatusNoToken(username, targetUser, function(success, status){
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
      exports.getUsersHomiesNoToken(username, function(success, homies){
        return callback(true, homies);
      });
    }
  });
}

// Finds all of the homies for an input user
exports.getUsersHomiesNoToken = function(username, callback){
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
      exports.getUsersHomieRequestsNoToken(username, function(success, homieRequests){
        return callback(true, homieRequests);
      });
    }
  });
}

// Gets pending homie requests for the user, split by 'pending' and 'waiting'
exports.getUsersHomieRequestsNoToken = function(username, callback){
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

// Deletes a request that the user has sent
exports.deleteHomieRequest = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call function to actually make the request
      exports.deleteHomieRequestNoToken(username, targetUser, function(success, msg){
        // Notify the targetUser in real time of request
        require('./real-time.js').emitEvent('homie request count change', {requestUser: username, acceptUser: targetUser});

        // Callback with success
        return callback(success, msg);
      });
    }
  });
}

// Removes the homie request sent by the user
exports.deleteHomieRequestNoToken = function(username, targetUser, callback){
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
    searchCriteria = {requestUser: username, acceptUser: targetUser};
    dbo.collection("homieRequests").findOne(searchCriteria, function(err, homieRequest){
      if (!homieRequest)
      {
        console.log("Unable to find homieRequest between '%s' and '%s'", targetUser, username);
        return callback(false, serverErrorMessage);
      } else {
        // Create the record to insert into homies
        homieRequest.deleteTime = Date.now();

        // Insert into homies
        dbo.collection("deletedHomieRequests").insertOne(homieRequest, function(err, insertResult){
          if(err){
            console.error("Unable to insert into deletedHomieRequests");
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
                console.log("Succesfully deleted homie request '%s' >>> '%s'", targetUser, username);
                return callback(true, "Succesfully deleted Homie Request");
              };
            });
          }
        });
      }
    });
  });
}

// Removes the target user from the users homie list
exports.removeUsersHomie = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call function to actually make the request
      exports.removeUsersHomieNoToken(username, targetUser, function(success, msg){
        // Notify the targetUser in real time of request
        require('./real-time.js').emitEvent('homie removal', {user: username, targetUser: targetUser});

        // Callback with success
        return callback(success, msg);
      });
    }
  });
}

// Removes the users homie relationship
exports.removeUsersHomieNoToken = function(username, targetUser, callback){
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
    // Get the homie record
    searchCriteria = {$or: [
      {requestUser: username, acceptUser: targetUser},
      {requestUser: targetUser, acceptUser: username}
    ]};
    dbo.collection("homies").findOne(searchCriteria, function(err, homiesRecord){
      if(err){
        console.error("Error occurred while checking homies");
        console.error(err);
        return callback(false, null);
      } else {
        // Set up the delete record
        homiesRecord.deleteUser = username;
        homiesRecord.deleteTime = Date.now();

        // Insert the delete record into the deletedHomies collection
        dbo.collection("deletedHomies").insertOne(homiesRecord, function(err, insertResult){
          if(err){
            console.error("Unable to insert into deletedHomies");
            console.error(err);
            return callback(false, serverErrorMessage);
          } else {
            // Delete frome the homies collection
            dbo.collection("homies").deleteOne(searchCriteria, function(err, deleteResult){
              db.close();
              if(err){
                console.error("Unable to delete from homies");
                console.error(err);
                return callback(false, serverErrorMessage);
              } else {
                console.log("Succesfully deleted homie relationship '%s' <=> '%s'", username, targetUser);
                return callback(true, "Succesfully removed '" + targetUser + "' from your homies.");
              }
            });
          }
        });
      }
    });
  });
}

// Blocks a the target user from contacting this user
// #TODO: Does this logically belong in this module?
exports.blockUser = function(token, username, targetUser, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call function to actually make the request
      exports.blockUserNoToken(username, targetUser, function(success, msg){
        // Callback with success
        return callback(success, msg);
      });
    }
  });
}

// Creates a record in userBlocks
// #TODO: Does this logically belong in this module?
exports.blockUserNoToken = function(username, targetUser, callback){
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

    // Create a record to insert into the user blocks
    blockRecord = {
      username: username,
      blockedUser: targetUser,
      creationTime: Date.now()
    };

    // Insert the record into the userBlocks
    dbo.collection("userBlocks").insertOne(blockRecord, function(err, insertResult){
      db.close();
      if(err){
        console.error("Unable to insert into userBlocks");
        console.error(err);
        return callback(false, serverErrorMessage);
      } else {
        console.log("User '%s' blocked '%s'", username, targetUser);
        return callback(true, "Successfully blocked user '" + targetUser + "'. You will no longer be able to see or contact each other.");
      }
    });
  });
}

// Finds all of the users that this user has blocked or that have blocked this user
exports.getBlocks = function(username, callback){
  // #TODO: Does this logically belong in this module?
  console.log("Finding blocks for '%s'", username);

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

    // Find all of a users blocks
    searchCriteria = {$or: [ {username: username}, {blockedUser: username} ]};
    dbo.collection("userBlocks").find(searchCriteria, function(err, blockRecords){
      if(err){
        console.error("An error occurred getting blocks for '%s'", username);
        console.error(err);
        return callback(false, null);
      } else {
        var blocks = [];
        // Loop through the records adding each homie to the array to return
        blockRecords.forEach(function(blockRecord){
          if(blockRecord.username == username){
            blocks.push(blockRecord.blockedUser);
          } else {
            blocks.push(blockRecord.username);
          }
        }, function(err){
          db.close();
          if(err){
            console.error("Error occurred while tying to loop through blocks for '%s'", username);
            console.error(err);
            return callback(false, null);
          } else {
            // Sort the homies in alphabetical order
            blocks.sort(function(a, b){return a > b});

            // Callback with the results
            return callback(true, blocks);
          }
        });
      }
    });
  });
}
