import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";

import { HttpsFunctionHandler } from "./types/utility";
import { throwErrorIfNotWorldOwner } from "./utils/permissions";
import { getWorldBySlug } from "./utils/world";

export const makeUserWorldOwner: HttpsFunctionHandler<{
  worldSlug: string | undefined;
  userEmail: string | undefined;
}> = async (data, context) => {
  const { userEmail, worldSlug } = data;

  if (!context.auth) {
    throw new HttpsError("internal", `Context was not passed`);
  }

  if (!worldSlug) {
    throw new HttpsError("internal", `World slug was not passed`);
  }

  if (!userEmail) {
    throw new HttpsError("internal", `User email was not passed`);
  }

  const world = await getWorldBySlug({ worldSlug });

  throwErrorIfNotWorldOwner({ userId: context.auth.uid, worldId: world.id });

  const authUser = await admin.auth().getUserByEmail(userEmail);

  await admin
    .firestore()
    .collection("worlds")
    .doc(world.id)
    .update({
      owners: admin.firestore.FieldValue.arrayUnion(authUser.uid),
    });

  return {
    userEmail: authUser.email,
  };
};

exports.makeUserWorldOwner = functions.https.onCall(makeUserWorldOwner);
