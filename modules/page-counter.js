exports.incrementPageCount = function(pageName, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Callback with error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      console.log(err);
      return callback(err, false);
    }
    var dbo = db.db();
    dbo.collection("pageCount", function(err, coll){
      if(err){
        console.log("Unable get pageCount collection to increment")
        console.log(err);
        return callback(err, false);
      }
      coll.countDocuments({pageName: pageName}, function(err, count){
        if(err){
          console.log("Unable to get a count for '%s'", pageName);
          console.log(err);
          return callback(err, false);
        }
        if(count == 0){
          // Insert new record with a count of one
          coll.insertOne({pageName: pageName, count: 1}, function(err, result){
            if(err){
              console.log("Unable to insert a new record for '%s'", pageName);
              console.log(err);
              return callback(err, false);
            }
            return callback(null, true);
          });
        } else {
          // Update record to increment it by one
          coll.updateOne({pageName: pageName}, {$inc: {count: 1}}, function(err, result){
            if(err){
              console.log("Unable to increment record for '%s'", pageName);
              console.log(err);
              return callback(err, false);
            }
            return callback(null, true);
          });
        }
      });
    });
  });
}

// Retreives the page counts for display
exports.getPageCounts = function(callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Callback with error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      console.log(err);
      return callback(err, false);
    }
    var dbo = db.db();
    dbo.collection("pageCount").find({}, {sort: {pageName: 1}}, function(err, results){
      if(err){
        console.log("Unable to retrieve page counts");
        console.log(err);
        return callback(err, null);
      }
      results.toArray(function(err, arr){
        return callback(err, arr);
      });
    });
  });
}
