// Variable to use for all communications
var io = null;

// JSON to track all active connections
var connectedUsers = {};

// Initializes the socket and creates the
exports.init = function(server){
  // Create instance of socket.io on the server
  io = require('socket.io')(server);

  // Set up socket.io listeners
  io.on('connection', (socket) => {
    // Gets the username from the cookies
    user = getUserFromCookies(socket);
    if(user){
      // Add the user to the JSON of active connections
      connectedUsers[user] = true;
      console.log("User '%s' has connected to real time service", user);

      socket.on('disconnect', () => {
        // Remove the user from the JSON of active connections
        delete connectedUsers[user];
        console.log("User '%s' has disconnected from real time service", user);
      });
    }
  });

  console.log('real-time.js has been initiliazed');
}

// Gets the username from the cookies
getUserFromCookies = function(socket){
  // Get the cookie string
  var cookieString = socket.handshake.headers.cookie;

  // Use a regex to get the value
  var re = new RegExp("user=([^;]+)");
  var value = re.exec(cookieString);

  // Return the value
  return (value != null) ? unescape(value[1]) : null;
}

// Wrapper for the io.emit
exports.emitEvent = function(eventName, eventArgs){
  if(!io){
    console.error("Unable to emit '%s' real-time.js has not been initiliazed", eventName);
  } else {
    console.log("Event '%s' emitted by real-time.js", eventName);
    io.emit(eventName, eventArgs);
  }
}

// Checks if a specific user is connected
exports.checkIfConnected = function(username){
  return connectedUsers[username] ? true : false;
}
