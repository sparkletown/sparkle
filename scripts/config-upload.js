var fs = require("fs");
var firebase = require("firebase/app");
require("firebase/firestore");
var validate = require("jsonschema").validate;

var schema = require("./schema.json");

function usage() {
  console.log(`
${process.argv[1]}: Upload event config

Config will be validated using schema.json in the script directory,
then uploaded to the config collection in the co-reality-map firestore.

Usage: node ${process.argv[1]} EVENT_NAME CONFIG_PATH

Example: node ${process.argv[1]} example example.js
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 2) {
  usage();
}

config = argv[0];
path = argv[1];

var doc = require(path);
console.log("Loaded document:", doc);

var validateResult = validate(doc, schema);
console.log("Validation result:", validateResult);

if (!validateResult.valid) {
  console.error("Invalid document, skipping upload");
} else {
  const firebaseConfig = {
    projectId: "co-reality-map",
  };
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  firestore.doc(`config/${config}`).set(doc);
}
