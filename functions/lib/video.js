"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const agora_1 = require("./utils/agora");
const assert_1 = require("./utils/assert");
const twilio_1 = require("./utils/twilio");
const taxonomy_js_1 = require("./taxonomy.js");
// @debt either remove data.identity entirely, or validate that it matches the context.auth.uid
//   (once checking that this won't break anything in the app)
exports.getTwilioToken = functions.https.onCall((data, context) => {
    (0, assert_1.assertValidAuth)(context);
    if (!data || !data.identity || !data.room) {
        throw new https_1.HttpsError("invalid-argument", `identity or ${taxonomy_js_1.ROOM_TAXON.lower} data missing`);
    }
    const token = (0, twilio_1.twilioVideoToken)(data.identity, data.room);
    return {
        token: token.toJwt(),
    };
});
exports.getAgoraToken = functions.https.onCall((data, context) => {
    (0, assert_1.assertValidAuth)(context);
    // @debt we should enforce a stricter security requirement on channelName. Maybe use UUIDs?
    if (!data || !data.channelName || typeof data.channelName !== "string") {
        throw new https_1.HttpsError("invalid-argument", "channelName is required, and must be a string");
    }
    try {
        (0, agora_1.assertValidAgoraConfig)();
    }
    catch (error) {
        // Log the specific error details for further investigation
        functions.logger.error("assertValidAgoraConfig() failed", {
            error,
            channelName: data.channelName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            account: context.auth.uid,
        });
        throw new https_1.HttpsError("internal", "agora config missing or invalid");
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
    const token = (0, agora_1.generateAgoraTokenForAccount)({
        channelName: data.channelName,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        account: context.auth.uid,
        role: agora_1.RtcRole.PUBLISHER,
    });
    return {
        token,
    };
});
//# sourceMappingURL=video.js.map