import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";

import { assertValidAuth } from "./src/utils/assert";
import { twilioVideoToken } from "./src/utils/twilio";

type GetTwilioTokenProps = {
  identity: string;
  room: string;
};

// @debt either remove data.identity entirely, or validate that it matches the context.auth.uid
//   (once checking that this won't break anything in the app)
export const getTwilioToken = functions.https.onCall(
  (data: GetTwilioTokenProps | undefined, context) => {
    assertValidAuth(context);

    if (!data || !data.identity || !data.room) {
      throw new HttpsError("invalid-argument", "identity or room data missing");
    }

    const token = twilioVideoToken(data.identity, data.room);

    return {
      token: token.toJwt(),
    };
  }
);
