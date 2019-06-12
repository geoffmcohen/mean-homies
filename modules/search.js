// Error message to return if something goes wrong on the server side
const serverErrorMessage = "Server error occurred, please contact geoff@veganhomies.com if you continue to encounter this issue.";
const invalidTokenMessage = "Invalid user token provided. Please log out and back in and try again.";

// Gets the distance between two coordinates
exports.getDistance = function( fromLat, fromLng, toLat, toLng, convertToMiles = true){
  // Calculate the distance in meters
  var distanceInMeters = require('geolib').getDistance(
    {latitude: fromLat, longitude: fromLng},
    {latitude: toLat, longitude: toLng}
  );

  // Convert to KM or Miles based on last arg
  if(convertToMiles){
    return distanceInMeters / 1609.344;
  } else {
    return distanceInMeters / 1000;
  }
}

// Gets users near a location
exports.getUsersNearCoords = function(
  username,
  fromLat,
  fromLng,
  radius,
  useMiles,
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

    // Search for users excluding this user
    dbo.collection("userProfiles").find({username: {$ne : username}}, function(err, profiles){
      // Create an array to store results that are within the search area
      var nearbyProfiles = [];

      // Calculate the distance for each result and add it to the array if its in the search area
      profiles.forEach(function(profile){
        distance = exports.getDistance(fromLat, fromLng, profile.location.lat, profile.location.lng, useMiles);
        if(distance <= radius){
          profile.distance = distance;
          nearbyProfiles.push(profile);
        }
      }, function(err){
        db.close();
        if(err){
          console.error("Error occurred while trying to do location based search");
          console.error(err);
          return callback(false, null);
        }
        else {
          // Sort the results by distance and username
          nearbyProfiles.sort(function(a, b){
            if (a.distance == b.distance){
              return a.username > b.username;
            } else {
              return a.distance > b.distance;
            }
          });

          // Callback with the results
          return callback(true, nearbyProfiles);
        }
      });
    });
  });
}

// Finds users near the input user
exports.getUsersNearUser = function(username, radius, useMiles, callback){
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
    dbo.collection("userProfiles").findOne({username: username}, function(err, profile){
      if(!profile){
        console.error("No user found for '%s', unable to perform search.", username);
        return callback(sesrverErrorMessage, null);
      } else {
        // Now try to find users near this users coordinates
        exports.getUsersNearCoords(username, profile.location.lat, profile.location.lng, radius, useMiles, function(success, nearbyProfiles){
          if(!success){
            console.error("Unable to find users near '%s'", username);
            return callback(serverErrorMessage, null);
          } else{
            console.log("Found %d users near '%s'", nearbyProfiles.length, username);
            return callback(require('util').format("Found %d users near you.", nearbyProfiles.length), nearbyProfiles);
          }
        });
      }
    });
  });
}

// Finds coordinates for an input location using Google Geocoder API
exports.findCoordsForLocation = function(location, callback){
  var request = require('request');
  var querystring = require('querystring');
  var util = require('util');

  var key = process.env.GOOGLE_GEOCODER_KEY;
  var url = util.format("https://maps.googleapis.com/maps/api/geocode/json?%s", querystring.stringify({address: location, key: key}));

  // Make the call to the API
  request(url, (err, res, body) => {
    // Parse the body into JSON
    var response = JSON.parse(body);

    if (err){
      console.error("Error occurred while trying to get coordinates using Google Geocoder API");
      console.error(err);
      return callback(util.format("Unable to find location '%s' with Google Maps", location), null);
    } else if(response.status = "OK" && response.results[0]){
      console.log("Found location '%s'", location);
      var foundLocation = response.results[0];
      return callback("Found location", {latitude: foundLocation.geometry.location.lat, longitude: foundLocation.geometry.location.lng});
    } else {
      return callback(util.format("Unable to find location '%s' with Google Maps", location), null);
    }
  });
}

// Finds users near location
exports.getUsersNearLocation = function(username, location, radius, useMiles, callback){
  // Try to find the location
  exports.findCoordsForLocation(location, function(message, coords){
    if(!coords){
      console.log("Unable to find coordinates for '%s' to do search.", location);
      return callback(message, null);
    } else {
      // Now search for nearby users
      exports.getUsersNearCoords(username, coords.latitude, coords.longitude, radius, useMiles, function(success, nearbyProfiles){
        if(!success){
          console.error("Unable to find users near '%s'", username);
          return callback(serverErrorMessage, null);
        } else{
          console.log("Found %d users near '%s'", nearbyProfiles.length, username);
          return callback(require('util').format("Found %d users near you.", nearbyProfiles.length), nearbyProfiles);
        }
      });
    }
  });
};

// Performs the token validation and searches for users near the input user
exports.searchForUsersNearUser = function(token, username, radius, useMiles, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(invalidTokenMessage, null);
    } else {
      exports.getUsersNearUser(username, radius, useMiles, function(message, nearbyProfiles){
        return callback(message, nearbyProfiles);
      });
    }
  });
};

// Performs the token validation and searches for users near the input location
exports.searchForUsersNearLocation = function(token, username, location, radius, useMiles, callback){
  // Check to make sure this is the users token
  require('./auth.js').verifyUser(token, username, 'user', function(err, isTokenValid){
    if(!isTokenValid){
      console.error('Error encountered while trying to verify user token');
      console.error(err);
      return callback(invalidTokenMessage, null);
    } else {
      exports.getUsersNearLocation(username, location, radius, useMiles, function(message, nearbyProfiles){
        return callback(message, nearbyProfiles);
      });
    }
  });
};
