// Function to create a new admin user
// #TODO: Add a check for admin user token
exports.createAdminUser = function(username, password){
  console.log("Creating admin user for '%s'...", username);

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

    // Check if the user already exists and throw error if so
    dbo.collection("adminUsers", function(err, coll){
      if(err){
        console.log("Unable to get adminUsers collection!");
        return;
      }
      coll.countDocuments({username: username}, function(err, count){
        if(err){
          console.log("Unable to execute countDocuments on adminUsers!");
          throw err;
        };
        if(count > 0){
          console.log("Admin User '%s' already exists!!!", username);
          throw new Error("Cannot create '" + username + "', user already exists!");
        } else {
          // Create the user object and hash the password
          var adminUser = {username: username};
          const bcrypt = require('bcrypt');
          adminUser.passwordHash = bcrypt.hashSync(password, 10);

          // Insert the user into the database
          dbo.collection("adminUsers").insertOne(adminUser, function(err, res){
              if(err) throw err;
              console.log("Succesfully created adminUser '%s'.", username);
          });
          db.close();
        }
      });
    });
  });
}

// Function to delete an admin user
// #TODO: Add a check for admin user token
exports.deleteAdminUser = function(username){
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
    dbo.collection("adminUsers", function(err, coll){
      if(err){
        console.log("Unable to get adminUsers collection!");
        throw err;
      }
      coll.deleteMany({username: username}, function(err, results){
        if(err){
          console.log("Unable to execute remove on adminUsers");
          throw(err);
        }
        console.log("Removed %d records for username '%s'", results.deletedCount, username);
        db.close();
      })
    });
  });
}

// Function to authenticate a user
exports.authenticateAdminUser = function(username, password, callback){
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
    dbo.collection("adminUsers").findOne({username: username}, function(err, result){
      db.close();
      if(result == null){
        console.log("No user found for '%s'", username);
        callback(null, false);
      } else {
        // Check the password
        const bcrypt = require('bcrypt');
        bcrypt.compare(password, result.passwordHash, function(err, result){
            if(result){
              console.log("User %s authenticated", username);
              updateLastLoginTime(username);
              callback(null, true);
            }
            else {
              console.log("Wrong password for user %s", username);
              callback(null, false);
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
    dbo.collection("adminUsers").updateOne({username: username}, newValues, function(err, result){
      if(err) throw err;
      console.log("Updated lastLoginTime for '%s'", username);
      db.close();
    });
  });
}
