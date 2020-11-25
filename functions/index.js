const firebase = require("firebase");
const admin = require("firebase-admin");

require("firebase/firestore");
const functions = require("firebase-functions");

const firebaseConfig = {
  projectId: functions.config().project.id,
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  ...firebaseConfig,
  credential: admin.credential.cert({
    ...functions.config().service_account,
    private_key: functions
      .config()
      .service_account.private_key.replace(/\\n/g, "\n"),
  }),
});

const video = require("./video");
const payment = require("./payment");
const venue = require("./venue");
const stats = require("./stats");

// Case-insensitive first character for iDevices
function lowercaseFirstChar(password) {
  return password.charAt(0).toLowerCase() + password.substring(1);
}

function passwordsMatch(submittedPassword, actualPassword) {
  return (
    submittedPassword === actualPassword ||
    lowercaseFirstChar(submittedPassword) === lowercaseFirstChar(actualPassword)
  );
}

exports.checkPassword = functions.https.onCall(async (data) => {
  await firebase
    .firestore()
    .doc(`venues/${data.venue}`)
    .get()
    .then((doc) => {
      if (
        doc &&
        doc.exists &&
        doc.data() &&
        doc.data().password &&
        passwordsMatch(data.password, doc.data().password)
      ) {
        return "OK";
      }
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Password incorrect"
      );
    });
});

exports.video = video;
exports.payment = payment;
exports.venue = venue;
exports.stats = stats;
