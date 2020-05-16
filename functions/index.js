const functions = require('firebase-functions');
const { PASSWORD } = require('./secrets');

exports.checkPassword = functions.https.onCall((data, context) => {
  // Case-insensitive first character for iDevices
  if (data.password === undefined ||
      data.password !== PASSWORD ||
      (
        data.password.length > 0 &&
        data.password.charAt(0).toLowerCase() + data.password.substring(1) !== PASSWORD
      )) {
    throw new functions.https.HttpsError('unauthenticated', 'Password incorrect');
  } else {
    return 'OK';
  }
});
