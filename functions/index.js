const functions = require("firebase-functions");
const { PASSWORD, ADMIN_PASSWORD } = require("./secrets");

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

exports.checkPassword = functions.https.onCall((data, context) => {
  if (data && data.password && !passwordsMatch(data.password, PASSWORD)) {
    return "OK";
  }

  throw new functions.https.HttpsError("unauthenticated", "Password incorrect");
});

exports.checkAdminPassword = functions.https.onCall((data, context) => {
  if (data && data.password && !passwordsMatch(data.password, ADMIN_PASSWORD)) {
    return "OK";
  }

  throw new functions.https.HttpsError("unauthenticated", "Password incorrect");
});
