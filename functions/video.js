const functions = require("firebase-functions");

const { twilioVideoToken } = require("./src/utils/twilio");

const PROJECT_ID = functions.config().project.id;

exports.getTwilioToken = functions.https.onCall((data, context) => {
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== PROJECT_ID) {
    throw new functions.https.HttpsError("permission-denied", "Token invalid");
  }

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
