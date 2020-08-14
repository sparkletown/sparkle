global.XMLHttpRequest = require("xhr2");
var firebase = require("firebase");
var read = require("read");
var fs = require("fs");
var path = require("path");
require("firebase/storage");

function usage() {
  console.log(`
  ${process.argv[1]}: Upload file to Firebase storage

  Usage: node ${process.argv[1]} PROJECT_ID API_KEY STORAGE_PATH FILENAME [USERNAME] [PASSWORD]

  Example: node ${process.argv[1]} co-reality-map aaazzz111222333 images image.jpg
  Example: node ${process.argv[1]} co-reality-map aaazzz111222333 images image.jpg user@name.com password
`);
  process.exit(1);
}

function uploadFile(
  username,
  password,
  projectId,
  apiKey,
  storagePath,
  filename
) {
  if (!fs.existsSync(filename)) {
    console.error(`File ${filename} does not exist`);
    process.exit(1);
  }
  var fileContent = fs.readFileSync(filename);
  var filenameOnly = path.basename(filename);

  const filePath = `${storagePath}/${filenameOnly}`;
  console.log(`Uploading ${filename} contents to user's ${filePath}...`);

  const firebaseConfig = {
    apiKey,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
  };
  firebase.initializeApp(firebaseConfig);
  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then(function (result) {
      const userFilePath = `users/${result.user.uid}/${filePath}`;
      console.log(`Uploading to ${userFilePath}`);
      const storageRef = firebase.storage().ref();
      storageRef
        .child(userFilePath)
        .put(fileContent)
        .then(function (snapshot) {
          console.log("Upload succeeded.");
          snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log(`URL: ${downloadURL}`);
            process.exit(0);
          });
        })
        .catch(function (err) {
          console.error("Error occurred:", err);
          process.exit(1);
        });
    })
    .catch(function (err) {
      console.error("Error occurred:", err);
      process.exit(1);
    });
}

const argv = process.argv.slice(2);
if (argv.length < 4) {
  usage();
}
var projectId = argv[0];
var apiKey = argv[1];
var storagePath = argv[2];
var filename = argv[3];

var username;
var password;
if (argv.length >= 6) {
  username = argv[4];
  password = argv[5];
}

if (username && password) {
  uploadFile(username, password, projectId, apiKey, storagePath, filename);
} else {
  console.log(`log in to upload.`);
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

      console.log("Login succeeded!");
      uploadFile(username, password, projectId, apiKey, storagePath, filename);
    });
  });
}
