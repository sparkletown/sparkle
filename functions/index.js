const firebase = require("firebase");
require("firebase/firestore");
const functions = require("firebase-functions");

const firebaseConfig = {
  projectId: "co-reality-map",
};
firebase.initializeApp(firebaseConfig);

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

exports.checkPassword = functions.https.onCall(async (data, context) => {
  await firebase
    .firestore()
    .doc(`config/${data.config}`)
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

exports.checkAdminPassword = functions.https.onCall(async (data, context) => {
  await firebase
    .firestore()
    .doc(`config/${data.config}`)
    .get()
    .then((doc) => {
      if (
        doc &&
        doc.exists &&
        doc.data() &&
        doc.data().admin_password &&
        passwordsMatch(data.password, doc.data().admin_password)
      ) {
        return "OK";
      }
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Password incorrect"
      );
    });
});
