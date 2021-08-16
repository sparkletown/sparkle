var fs = require("fs");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var read = require("read");

const usage = () => {
  console.log(`
${process.argv[1]}: Upload new member emails

Merges the member array in the venue config with existing emails and saves the result.

Usage: node ${process.argv[1]} API_KEY VENUE_NAME EMAIL_FILE [USERNAME] [PASSWORD]

Example: node ${process.argv[1]} aaazzz111222333 example member_emails_one_per_line.txt
Example: node ${process.argv[1]} aaazzz111222333 example member_emails_one_per_line.txt user@name.com password
`);
  process.exit(1);
};

const mergeEmails = (username, password, apiKey, venueId, newEmails) => {
  const path = `venues/${venueId}`;

  const firebaseConfig = {
    apiKey: apiKey,
    projectId: "co-reality-map",
  };
  firebase.initializeApp(firebaseConfig);
  console.log(`Reading doc at ${path} as ${username}:${password}...`);
  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then(() => {
      firebase
        .firestore()
        .doc(path)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.error(`Document ${path} does not exist`);
            process.exit(1);
          }
          const emails = doc.data()?.config?.memberEmails || [];
          console.log(`Existing emails found: ${emails.join(",")}`);
          newEmails.forEach((email) => {
            if (email && email.length && !emails.includes(email)) {
              emails.push(email);
            }
          });
          console.log(`Merged list: ${emails.join(",")}`);
          const newDoc = doc.data();
          if (!newDoc.config) {
            newDoc.config = {};
          }
          newDoc.config.memberEmails = emails;

          console.log("Writing emails list...");
          firebase
            .firestore()
            .doc(path)
            .set(newDoc)
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
    });
};

const argv = process.argv.slice(2);
if (argv.length < 3) {
  usage();
}
var apiKey = argv[0];
var venueId = argv[1];
var path = argv[2];

var username;
var password;
if (argv.length >= 5) {
  username = argv[3];
  password = argv[4];
}

if (!fs.existsSync(path)) {
  console.error("Path does not exist:", path);
  process.exit(1);
}

var emails = [];
fs.readFileSync(path, "utf-8")
  .split(/\r?\n/)
  .forEach((line) => {
    emails.push(line);
  });
console.log(
  `Merging ${emails.length} email addresses into ${venueId}: ${emails.join(
    ","
  )}...`
);

if (username && password) {
  mergeEmails(username, password, apiKey, venueId, emails);
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
      mergeEmails(username, password, apiKey, venueId, emails);
    });
  });
}
