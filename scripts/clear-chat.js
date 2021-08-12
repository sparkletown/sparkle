var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var read = require("read");

const usage = () => {
  console.log(`
${process.argv[1]}: Upload event config

Config will be validated using schema.json in the script directory,
then uploaded to the config collection in the co-reality-map firestore.

Usage: node ${process.argv[1]} API_KEY DELETE_BEFORE_SECONDS_SINCE_EPOCH

Example: node ${process.argv[1]} aaazzz111222333 1592672400
`);
  process.exit(1);
};

const argv = process.argv.slice(2);
if (argv.length < 2) {
  usage();
}
var apiKey = argv[0];
var deleteBeforeSecondsSinceEpoch = argv[1];

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
    const deleteBefore = firebase.firestore.Timestamp.fromDate(
      new Date(deleteBeforeSecondsSinceEpoch * 1000)
    );

    const firebaseConfig = {
      apiKey: apiKey,
      projectId: "co-reality-map",
    };
    firebase.initializeApp(firebaseConfig);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        firebase
          .firestore()
          .collection("chatsv3")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.data().ts_utc < deleteBefore) {
                console.log("deleting: " + doc.id);
                firebase.firestore().collection("chatsv3").doc(doc.id).delete();
              }
            });
          });
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  });
});
