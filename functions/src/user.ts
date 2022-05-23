import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";

import { HttpsFunctionHandler } from "./types/utility";
import { throwErrorIfNotSuperAdmin } from "./utils/permissions";
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

  const world = await getWorldBySlug({ worldSlug });

  await throwErrorIfNotSuperAdmin(context.auth.token.user_id);

  const worldRef = admin.firestore().collection("worlds").doc(world.id);

  let addedAuthUser;

  if (userEmail) {
    addedAuthUser = await admin.auth().getUserByEmail(userEmail);

    await worldRef.update({
      owners: admin.firestore.FieldValue.arrayUnion(addedAuthUser.uid),
    });
  }

  const updatedWorld = await (await worldRef.get()).data();

  const worldAdminIds = updatedWorld ? updatedWorld.owners : [];

  const worldAdmins = await Promise.all(
    worldAdminIds.map(async (adminId: string) => {
      const worldAdmin = await admin
        .firestore()
        .collection("users")
        .doc(adminId)
        .get();

      return {
        id: worldAdmin.id,
        ...worldAdmin.data(),
      };
    })
  );

  return {
    userEmail: addedAuthUser?.email,
    worldAdmins,
  };
};

export const onboardUser: HttpsFunctionHandler<{
  worldSlug: string | undefined;
}> = async (data, context) => {
  const { worldSlug } = data;

  if (!context.auth) {
    throw new HttpsError("internal", `Context was not passed`);
  }

  if (!worldSlug) {
    throw new HttpsError("internal", `World slug was not passed`);
  }

  const world = await getWorldBySlug({ worldSlug });

  const userRef = admin.firestore().collection("users").doc(context.auth.uid);

  const onboardedWorldRef = userRef.collection("onboardedWorlds").doc(world.id);

  await onboardedWorldRef.set({ isOnboarded: true });
  return (await onboardedWorldRef.get()).data();
};

exports.makeUserWorldOwner = functions.https.onCall(makeUserWorldOwner);
exports.onboardUser = functions.https.onCall(onboardUser);
