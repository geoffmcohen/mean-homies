// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";
const invalidTokenMessage = "Invalid user token provided. Please log out and back in and try again.";

// Function called by api to send a new message from the user to the target user
exports.sendMessage = function(token, username, targetUser, messageText, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, invalidTokenMessage);
    } else {
      // Call the function to get the status
      exports.sendMessageNoToken(username, targetUser, messageText, function(success, message){
        // Notify the targetUser in real time of request
        require('./real-time.js').emitEvent('new message', {sendUser: username, recieveUser: targetUser});

        // Callback with results
        return callback(success, message);
      });
    }
  });
}

// Inserts a new message in the message collection
exports.sendMessageNoToken = function(username, targetUser, messageText, callback){
  console.log("'%s sent a message to '%s", username, targetUser);

  // Check homie status to make sure they are homies first
  require('./homies.js').getHomieStatusNoToken(username, targetUser, function(success, status){
    if(!success){
      console.error("Unable to send a message due to error retreiving homie status between '%s' and '%s'", username, targetUser);
      return callback(false, serverErrorMessage);
    } else if(status != 'homies'){
      console.warn("User '%s' attempted to send '%s' a message, but they are not homies.", username, targetUser);
      return callback(false, "Unable to send message to " + targetUser + " because they are not currently one of your Homies.");
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

        // Create the message
        message = {
          conversationId: username < targetUser ? username + '-' + targetUser : targetUser + '-' + username,
          sendUser: username,
          recieveUser: targetUser,
          messageText: messageText,
          sendTimestamp: Date.now(),
          status: 'sent'
        };

        // Insert the message into the database
        dbo.collection("messages").insertOne(message, function(err, insertResult){
          db.close();
          if(err){
            console.error("Error inserting new message '%s' -> '%s'", username, targetUser);
            console.error(err);
            return callback(false, serverErrorMessage);
          } else {
            console.log("Succesfully inserted new message '%s' -> '%s'", username, targetUser);
            return callback(true, "Succesfully sent message to " + targetUser);
          }
        });
      });
    }
  });
}

// Function called by the api to get all the messages between the user and targetUser sent after the startTime
exports.getMessages = function(token, username, targetUser, startTime, callback){
}

// Gets the messages between the user and the targetUser
exports.getMessagesNoToken = function(username, targetUser, startTime, callback){
}

// Marks a message as read in the database once it's been retreived
markMessageAsRead = function(message, callback){
}

// Gets all unread messages for the user
exports.getUsersUnreadMessages = function(token, username, callback){
}

// Retrieves all unread messages for the user
exports.getUsersUnreadMessagesNoToken = function(username, callback){
}
