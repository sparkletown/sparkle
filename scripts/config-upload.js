var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var validate = require("jsonschema").validate;
var read = require("read");

// Change this to upload a different type of Venue
// var schema = require("./schema.json");
var schema = require("./venue-schema.json");

const usage = () => {
  console.log(`
${process.argv[1]}: Upload event config

Config will be validated using schema.json in the script directory,
then uploaded to the config collection in the co-reality-map firestore.

Usage: node ${process.argv[1]} PROJECT_ID API_KEY EVENT_NAME CONFIG_PATH [USERNAME] [PASSWORD]

Example: node ${process.argv[1]} co-reality-map aaazzz111222333 example example.js
Example: node ${process.argv[1]} co-reality-map aaazzz111222333 example example.js user@name.com password
`);
  process.exit(1);
};

const uploadConfig = (username, password, projectId, apiKey, venueId, doc) => {
  const path = `venues/${venueId}`;
  console.log(`Uploading "${venueId}" to venues: ${path}...`);

  const firebaseConfig = {
    apiKey,
    projectId,
  };
  firebase.initializeApp(firebaseConfig);
  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then(() => {
      firebase
        .firestore()
        .doc(path)
        .set(doc)
        .then(() => {
          console.log(`Document ${path} successfully written!`);
          process.exit(0);
        })
        .catch((err) => {
          console.error("Error writing document: ", err);
          process.exit(1);
        });
    })
    .catch((err) => {
      console.error("Login error:", err);
    });
};

const argv = process.argv.slice(2);
if (argv.length < 4) {
  usage();
}
var projectId = argv[0];
var apiKey = argv[1];
var venueId = argv[2];
var path = argv[3];
var doc = require(path);

var username;
var password;
if (argv.length >= 6) {
  username = argv[4];
  password = argv[5];
}
var validateResult = validate(doc, schema);
if (!validateResult.valid) {
  console.error(
    "Invalid document, skipping upload. Validation result:",
    validateResult
  );
} else {
  console.log(`Validation of ${path} succeeded!`);
  if (username && password) {
    uploadConfig(username, password, projectId, apiKey, venueId, doc);
  } else {
    console.log(`log in to upload.`);
    read({ prompt: "Username:" }, (err, username) => {
      if (err) {
        console.error("Error obtaining username:", err);
        process.exit(1);
      }
      read({ prompt: "Password:", silent: true }, (err, password) => {
        if (err) {
          console.error("Error obtaining password:", err);
          process.exit(1);
        }

        console.log("Login succeeded!");
        uploadConfig(username, password, projectId, apiKey, venueId, doc);
      });
    });
  }
}
