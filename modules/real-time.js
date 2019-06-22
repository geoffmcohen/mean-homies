// Variable to use for all communications
var io = null;

// Initializes the socket and creates the
exports.init = function(server){
  // Create instance of socket.io on the server
  io = require('socket.io')(server);

  // Set up socket.io listeners
  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  console.log('real-time.js has been initiliazed');
}

// Wrapper for the io.emit
exports.emitEvent =function(eventName, eventArgs){
  if(!io){
    console.error("Unable to emit '%s' real-time.js has not been initiliazed", eventName);
  } else {
    console.log("Event '%s' emitted by real-time.js", eventName);
    io.emit(eventName, eventArgs);
  }
}
