exports.incrementPageCount = function(pageName, callback){
  // Increment the daily page request count
  exports.incrementDailyPageCount(pageName);

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

// Adds to various page stats
exports.recordPageStats = function(pageName, username, isMobile){
  // Increment the page count
  exports.incrementPageCount(pageName, function(err, success){});

  // Record daily user activity
  if(username) exports.recordDailyActiveUser(username, isMobile);
}

// Gets the current date as a YYYYMMDD string
getDateString = function(){
  // Get the current time
  var now = new Date();

  // Get the year from the time
  var year = String(now.getFullYear());

  // Get the month from the time and add a leading '0' if neccessary
  var month = String(now.getMonth() + 1);
  if(month.length == 1) month = "0" + month;

  // Get the day from the time and add a leading '0' if neccessary
  var day = String(now.getDate());
  if(day.length == 1) day = "0" + day;

  // Return YYYYMMDD
  return year + month + day;
}

// Increments the daily page count for the day
exports.incrementDailyPageCount = function(pageName){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Callback with error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      console.log(err);
      return;
    }
    var dbo = db.db();

    // Get the current date
    var dateString = getDateString();

    // Try to get todays record from the collection
    dbo.collection("pageCountsDaily").findOne({date: dateString}, function(err, pageCountsRecord){
      if(err){
        db.close();
        console.error("Error occurred while trying to get pageCountsDaily for '%s'", dateString);
        console.error(err);
        return;
      } else if(pageCountsRecord == null) {
        // Create the record to insert
        var pageCounts = {};
        pageCounts[pageName] = 1;
        var pageCountsRecord = {
          date: dateString,
          pageCounts: pageCounts
        };

        // Insert the new record
        dbo.collection("pageCountsDaily").insertOne(pageCountsRecord, function(err, insertResult){
          db.close();
          if(err){
            console.error("Error occurred while trying to insert into pageCountsDaily");
            console.error(err);
          } else {
            console.log("Succesfully inserted into pageCountsDaily for '%s'", dateString);
          }
          return;
        });
      } else {
        // Increment the page count for the givin page
        var pageCounts = pageCountsRecord.pageCounts;
        if(pageCounts[pageName]){
          pageCounts[pageName]++;
        } else {
          pageCounts[pageName] = 1;
        }

        // Update the existing record
        dbo.collection("pageCountsDaily").updateOne({date: dateString}, {$set: {pageCounts: pageCounts}}, function(err, updateResult){
          db.close();
          if(err){
            console.error("Error occurred while trying to update record in pageCountsDaily");
            console.error(err);
          } else {
            console.log("Succesfully updated pageCountsDaily for '%s'", dateString);
          }
          return;
        });
      }
    });
  });
}

// Records that the user made a request today
// #TODO: This needs to be implemented
exports.recordDailyActiveUser = function(username, isMobile){
  console.log("recordDailyActiveUser called for '%s', '%s'", username, isMobile);
}
