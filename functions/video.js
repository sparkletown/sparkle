const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const {
  RtcRole,
  assertValidAgoraConfig,
  generateAgoraTokenForAccount,
} = require("./src/utils/agora");
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

exports.getAgoraToken = functions.https.onCall((data, context) => {
  assertValidAuth(context);

  // @debt we should enforce a stricter security requirement on channelName. Maybe use UUIDs?
  if (!data || !data.channelName || typeof data.channelName !== "string") {
    throw new HttpsError(
      "invalid-argument",
      "channelName is required, and must be a string"
    );
  }

  try {
    assertValidAgoraConfig();
  } catch (error) {
    // Log the specific error details for further investigation
    functions.logger.error("assertValidAgoraConfig() failed", {
      error,
      channelName: data.channelName,
      account: context.auth.uid,
    });

    throw new HttpsError("internal", "agora config missing or invalid");
  }

  // TODO: Figure out how we decide between using RtcRole.PUBLISHER / RtcRole.SUBSCRIBER, and when they are used
  //   From the docs:
  //     role
  //       – See #userRole.
  //       - Role.PUBLISHER; RECOMMENDED. Use this role for a voice/video call or a live broadcast.
  //       - Role.SUBSCRIBER: ONLY use this role if your live-broadcast scenario requires authentication for Hosting-in .
  //         In order for this role to take effect, please contact our support team to enable authentication for Hosting-in for you.
  //         Otherwise, Role_Subscriber still has the same privileges as Role_Publisher.
  //   See my discovery + explanation + solution at:
  //     https://github.com/AgoraIO/Tools/issues/83#issuecomment-869149777
  //   tl;dr We need to enable 'Co-Host token authentication' in the Agora admin console
  //     In a live streaming channel, when an audience member applies to co-host, you can use a token to authenticate whether the user can publish a stream. This feature is co-host token authentication.
  //   We need to check against firebase to ensure that the user requesting the host permissions is actually allowed to have them.
  const token = generateAgoraTokenForAccount({
    channelName: data.channelName,
    account: context.auth.uid,
    role: RtcRole.PUBLISHER,
  });

  return {
    token,
  };
});
