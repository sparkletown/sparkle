const functions = require('firebase-functions');
const { PASSWORD } = require('./secrets');

// Case-insensitive first character for iDevices
function lowercaseFirstChar(password) {
  return password.charAt(0).toLowerCase() + password.substring(1);
}

exports.checkPassword = functions.https.onCall((data, context) => {
  if (data.password === undefined ||
      (
        data.password.length > 0 &&
        lowercaseFirstChar(data.password) !== lowercaseFirstChar(PASSWORD)
      )) {
    throw new functions.https.HttpsError('unauthenticated', 'Password incorrect');
  } else {
    return 'OK';
  }
});
