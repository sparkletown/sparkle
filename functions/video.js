const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { assertValidAuth } = require("./src/utils/assert");
const { twilioVideoToken } = require("./src/utils/twilio");

// @debt either remove data.identity entirely, or validate that it matches the context.auth.uid
//   (once checking that this won't break anything in the app)
exports.getTwilioToken = functions.https.onCall((data, context) => {
  assertValidAuth(context);

  if (!data || !data.identity || !data.room) {
    throw new HttpsError("invalid-argument", "identity or room data missing");
  }

  const token = twilioVideoToken(data.identity, data.room);

  return {
    token: token.toJwt(),
  };
});
