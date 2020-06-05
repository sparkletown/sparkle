"use strict";

var fs = require("fs");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var validate = require("jsonschema").validate;
var read = require("read");

var schema = require("./schema.json");

function usage() {
  console.log(`
${process.argv[1]}: Upload event config

Config will be validated using schema.json in the script directory,
then uploaded to the config collection in the co-reality-map firestore.

Usage: node ${process.argv[1]} API_KEY EVENT_NAME CONFIG_PATH

Example: node ${process.argv[1]} aaazzz111222333 example example.js
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 3) {
  usage();
}
var apiKey = argv[0];
var config = argv[1];
var path = argv[2];
var doc = require(path);
console.log("Loaded document:", doc);

var validateResult = validate(doc, schema);
console.log("Validation result:", validateResult);

if (!validateResult.valid) {
  console.error("Invalid document, skipping upload");
} else {
  read({ prompt: "Username:" }, function (err, username) {
    if (err) {
      console.error("Error obtaining username:", err);
      process.exit(1);
    }
    read({ prompt: "Password:", silent: true }, function (err, password) {
      if (err) {
        console.error("Error obtaining password:", err);
        process.exit(1);
      }

      const firebaseConfig = {
        apiKey: apiKey,
        projectId: "co-reality-map",
      };
      firebase.initializeApp(firebaseConfig);
      firebase
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(function () {
          firebase
            .firestore()
            .doc(`config/${config}`)
            .set(doc)
            .then(function () {
              console.log("Document successfully written!");
              process.exit(0);
            })
            .catch(function (err) {
              console.error("Error writing document: ", err);
              process.exit(1);
            });
        })
        .catch(function (err) {
          console.error("Login error:", err);
        });
    });
  });
}
