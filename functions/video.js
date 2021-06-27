const functions = require("firebase-functions");

const { assertValidAuth } = require("./src/utils/assert");
const { twilioVideoToken } = require("./src/utils/twilio");

exports.getTwilioToken = functions.https.onCall((data, context) => {
  assertValidAuth(context);

  if (data && data.identity && data.room) {
    const token = twilioVideoToken(data.identity, data.room);
    return {
      token: token.toJwt(),
    };
  }

  throw new functions.https.HttpsError(
    "invalid-argument",
    "identity or room data missing"
  );
});
