var fs = require('fs');
var util = require('util');

// Set production based on BUILD_ENV environment variable
var buildEnv = process.env.BUILD_ENV || 'DEV';
var isProd = "false";
if (buildEnv == "PROD") isProd = "true";

// Get the google api keys from build system environment
var googleMapsKey = process.env.GOOGLE_MAPS_KEY || null;
var googleGeocoderKey = process.env.GOOGLE_GEOCODER_KEY || null;

// Test to make sure keys are provided
if (!googleMapsKey || !googleGeocoderKey){
  console.error("create_env.js: Missing required environnment variables!!!");
  process.exit(1);
}

// Create the file content
var content = util.format(
`// Dynamically created by create_env.js
export const environment = {
  production: %s,
  google_maps_key: '%s',
  google_geocoder_key: '%s'
};`,
  isProd,
  googleMapsKey,
  googleGeocoderKey
);

// Write the file
fs.writeFile('./src/environments/environment.ts', content, function(err){
  if( err ){
    console.error("Unable to write environment file!!!");
    console.error(err);
    process.exit(1);
  }
  console.log("Succesfully created /src/environments/environments.ts");
});
