// Gets the blog posts to display
exports.getBlogPosts = function(page, postsPerPage, callback){
  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    if(err){
      console.error("Unable to connect to MongoDB");
      console.error(err);
      throw err;
    } else {
      // Get the collection
      var dbo = db.db();
      dbo.collection("blog", function(err, coll){
        if(err){
          console.console.error("Unable to get collection blog");
          return callback(false, null);
        } else {
          // Find all records sorted last to first
          coll.find({}, {sort:{entryTime: -1}}, function(err, items){
            if(err){
              console.error("Unable to execute find on blog collection");
              return callback(false, null);
            } else {
              // Get paged data
              items = items.skip(postsPerPage * (page - 1)).limit(postsPerPage);

              // Convert the cursor to an array
              items.toArray(function(err, arr){
                // Create return JSON with the array and information about paging
                var ret = {blogPosts: arr, pageInfo: {currentPage: parseInt(page)}};

                // Perform a count to determine how many pages total
                coll.countDocuments(function(err, count){
                  ret.pageInfo.pageCount = Math.ceil(count / postsPerPage);
                  return callback(true, ret);
                });
              });
            }
          });
        }
      });
    }
  });
}

// Function used to insert a new post into the database
exports.insertBlogPost = function(blogPost, callback){
  console.log("Publishing blog post '%s'...", blogPost.title);

  // Connect to the database
  var MongoClient = require('mongodb').MongoClient;
  var mongoURI = process.env.MONGOLAB_URI;
  MongoClient.connect(mongoURI, {useNewUrlParser: true}, function(err, db){
    // Callback with error if unable to connect
    if(err){
      console.log("Unable to connect to MongoDB!!!");
      return callback(err, false);
    }
    var dbo = db.db();

    // Wrap paragraphs with <p></p>
    blogPost.body = "<p>" + blogPost.body.replace(/\n\n/g, "</p><p>", ) + "</p>";

    // Add the entry time if object has none
    if(!blogPost.entryTime) {
      blogPost.entryTime = Date.now();
    }

    // Check if the post has an image that needs to uploaded first
    if(blogPost.image_file){
      console.log("Attempting to upload image file '%s'...", blogPost.image_file);
      // Upload the image first
      var cloudinary = require('cloudinary');
      cloudinary.v2.uploader.upload(blogPost.image_file, {folder: "blog"}, function(err, result){
        if(err){
          console.log("Image failed to upload");
          console.log(err);
          return callback(err, false);
        }

        // Delete the local temp image file
        fs = require('fs');
        fs.unlink(blogPost.image_file, function(err){
          console.log("Unable to remove file '%s'", blogPost.image_file);
          console.log(err);
        });

        // Get the image url
        blogPost.image_url = result.url;
        console.log("Uploaded blog image to '%s'", blogPost.image_url);

        // Remove the image_file element
        delete blogPost.image_file;

        // Now add the blog post
        dbo.collection("blog").insertOne(blogPost, function(err, res){
          if(err) {
            return callback(err, false);
          } else {
            console.log("Successfully inserted new blog post!");
            db.close();
            callback(err, true);
          }
        });
      });
    } else {
      // Add the blog post
      dbo.collection("blog").insertOne(blogPost, function(err, res){
        if(err) {
          return callback(err, false);
        } else {
          console.log("Successfully inserted new blog post!");
          db.close();
          callback(err, true);
        }
      });
    }
  });
}
