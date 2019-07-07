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
          conversationId: createConversationId(username, targetUser),
          sendUser: username,
          receiveUser: targetUser,
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

            // Use the real time module
            var rt = require('./real-time.js');

            // Notify the targetUser in real time of request
            rt.emitEvent('new message', {conversationId: message.conversationId, sendUser: username, receiveUser: targetUser, sendTimestamp: message.sendTimestamp });

            // Send an email notification to the target user if they are not currently connected
            if(!rt.checkIfConnected(targetUser)){
              exports.sendMessageNotificationEmail(username, targetUser, messageText);
            }

            return callback(true, "Succesfully sent message to " + targetUser);
          }
        });
      });
    }
  });
}

// Returns a string with the usernames appended with a dash with the usernames sorted in order
createConversationId = function(user1, user2){
  return user1 < user2 ? user1 + '-' + user2 : user2 + '-' + user1;
}

// Sends the user an email notification
exports.sendMessageNotificationEmail = function(username, targetUser, messageText, send = true, preview = false ){
  console.error("sendMessageNotificationEmail has been called, but not yet implemented");
}

// Function called by the api to get all the messages between the user and targetUser sent after the startTime
exports.getMessages = function(token, username, targetUser, startTime, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      // Call the actual function to retreive the messages from the database
      exports.getMessagesNoToken(username, targetUser, startTime, function(success, messages){
        return callback(success, messages);
      });
    };
  });
}

// Gets the messages between the user and the targetUser
exports.getMessagesNoToken = function(username, targetUser, startTime, callback){
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

    // Set up search query to get the messages
    searchQuery = {
      conversationId: createConversationId(username, targetUser),
      sendTimestamp: {$gt: startTime}
    };

    // Search for messages in the conversation
    dbo.collection("messages").find(searchQuery, function(err, messages){
      if(err){
        db.close();
        console.error("Error occurred trying to get messages between '%s' and '%s'", username, targetUser);
        console.error(err);
        return callback(false, null);
      } else {
        // Create an array of the messages to return to the callback that will be sorted by sendTimestamp
        var sortedMessages = [];

        // Go through each message
        messages.forEach(function(message){
          // Mark the message as read if it's unread and sent to this user
          if(message.receiveUser == username && message.status == 'sent'){
            markMessageAsRead(message);
          }

          // Add the message to the array to return
          sortedMessages.push(message);
        }, function(err){
          db.close();
          if(err){
            console.error("Error occurred while trying iterate through messages between '%s' and '%s'", username, targetUser);
            console.error(err);
            return callback(false, null);
          } else {
            // Sort the results by sendTimestamp
            sortedMessages.sort(function(a, b){
              if(a.sendTimestamp == b.sendTimestamp){
                return a.sendUser > b.sendUser;
              } else {
                return a.sendTimestamp - b.sendTimestamp;
              }
            });

            // Callback with the results
            return callback(true, sortedMessages);
          }
        });
      }
    });
  });
}

// Marks a message as read in the database once it's been retreived
markMessageAsRead = function(message){
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

    // Create a new JSON to represent the updated data
    var updatedMessage = JSON.parse(JSON.stringify(message));
    delete updatedMessage._id;
    updatedMessage.status = 'read';
    updatedMessage.readTimestamp = Date.now();

    // Update the message
    dbo.collection("messages").updateOne(message, {$set: updatedMessage}, function(err, updateResult){
      db.close();
      if(err){
        console.error("Unable to mark message '%s-%s' as read", message.conversationId, message.sendTimestamp);
        console.error(err);
      } else {
        console.log("Message '%s-%s' marked as read", message.conversationId, message.sendTimestamp);

        // Notify the sender that the user has read their message
        var updateData = {
          conversationId: updatedMessage.conversationId,
          sendUser: updatedMessage.sendUser,
          receiveUser: updatedMessage.receiveUser,
          sendTimestamp: updatedMessage.sendTimestamp,
          readTimestamp: updatedMessage.readTimestamp,
          status: updatedMessage.status
        };
        require('./real-time.js').emitEvent('message marked as read', updateData);
      }
    });
  });
}

// Gets the count of unread messages for the user
exports.getUnreadMessageCount = function(token, username, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      // Get the actual unread count from the database
      exports.getUnreadMessageCountNoToken(username, function(success, count){
        return callback(success, count);
      });
    }
  });
}

// Retreives the count of unread messages for the user
exports.getUnreadMessageCountNoToken = function(username, callback){
  // Try to get blocks to remove conversations with blocked users
  require('./homies.js').getBlocks(username, function(success, blocks){
    // In the case of an error, allow us to get blocked conversations anyways as the frontend will block them
    if(!success) blocks = [];

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

      // Set up search query to get count of unread messages
      searchQuery = {receiveUser: username, status: 'sent', sendUser: {$nin: blocks}};

      // Search for unread messages for the user
      dbo.collection("messages").find(searchQuery).count(function(err, count){
        db.close();
        if(err){
          console.error("Error occurred while trying to get unread message count for '%s'", username);
          console.error(err);
          return callback(false, null);
        } else {
          console.log("Found %d unread messages for user '%s'", count, username);
          return callback(true, count);
        }
      });
    });
  });
}

// Gets the latest messages in all user conversations
exports.getLatestMessages = function(token, username, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else {
      // Get the actual conversations from the database
      exports.getLatestMessagesNoToken(username, function(success, messages){
        return callback(success, messages);
      });
    }
  });
}

// Retrieves the latest message in each conversation
exports.getLatestMessagesNoToken = function(username, callback){
  // Try to get blocks to remove conversations with blocked users
  require('./homies.js').getBlocks(username, function(success, blocks){
    // In the case of an error, allow us to get blocked conversations anyways as the frontend will block them
    if(!success) blocks = [];

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

      // Create the aggregation query
      var aggregationQuery = [
        {$match: {
          $and: [
              {$and: [{sendUser: {$nin: blocks}}, {receiveUser: {$nin: blocks}}]},
              {$or: [{sendUser: username}, {receiveUser: username}]}
            ]
          }
        },
        {$group: {
          _id: '$conversationId',
          lastSentTimestamp: {$max: '$sendTimestamp'}
        }},
        {$lookup: {
          from: 'messages',
          let: {convId: '$_id', lst: '$lastSentTimestamp'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$conversationId', '$$convId']},
                    {$eq: ['$sendTimestamp', '$$lst']}
                  ]
                }
              }
            }
          ],
          as:  'lastMessages'
        }}
      ];

      // Perform an aggregate
      dbo.collection("messages").aggregate(aggregationQuery, function(err, aggResults){
        if(err){
          db.close();
          console.error("Unable to aggregate conversations for user '%s'", username);
          console.error(err);
          return callback(false, null);
        } else {
          // Create an array to return in callback
          var lastMessages = [];

          // Loop through each aggregation result
          aggResults.forEach(function(aggResult){
            // Add the last message in each conversation to the array to return
            if(aggResult.lastMessages.length > 0){
              lastMessages.push(aggResult.lastMessages[0]);
            }
          }, function(err){
            db.close();
            if(err){
              console.error("Error occurred while trying to loop through conversations for '%s'", username);
              console.error(err);
              return callback(false, null);
            } else {
              // Sort the messages by sendTimestamp descending
              lastMessages.sort(function(a, b){
                  return b.sendTimestamp - a.sendTimestamp;
              });

              // Return the messages in the callback
              return callback(true, lastMessages);
            }
          });
        }
      });
    });
  });
}

// Gets a specific message
exports.getMessage = function(token, username, sendUser, receiveUser, sendTimestamp, markAsRead, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(false, null);
    } else if(username != sendUser && username != receiveUser) {
      console.warn("User '%s' has tried to get a message sent from '%s' to '%s'", username, sendUser, receiveUser);
      return callback(false, null);
    }
    else {
      // Get the actual conversations from the database
      exports.getMessageNoToken(sendUser, receiveUser, sendTimestamp, markAsRead, function(success, message){
        return callback(success, message);
      });
    }
  });
}

// Retrieves a specific message from the database
exports.getMessageNoToken = function(sendUser, receiveUser, sendTimestamp, markAsRead, callback){
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

    // Get the message from the database
    var searchCriteria = {sendUser: sendUser, receiveUser: receiveUser, sendTimestamp: sendTimestamp};
    dbo.collection("messages").findOne(searchCriteria, function(err, message){
      db.close();
      if(err){
        console.error("Error occurred while trying to get message from '%s' to '%s'", sendUser, receiveUser);
        console.error(err);
        return callback(false, null);
      } else if (message == null){
        console.error("No message found with search criteria:");
        console.error(searchCriteria);
        return callback(false, null);
      } else {
        // Mark the message as read if neccessary
        if(markAsRead) markMessageAsRead(message);

        // Return the message via callback
        return callback(true, message);
      }
    });
  });
}
