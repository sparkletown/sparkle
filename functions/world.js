const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { checkAuth } = require("./src/utils/assert");

const checkIsAdmin = async (uid) => {
  try {
    const adminDoc = await admin
      .firestore()
      .collection("roles")
      .doc("admin")
      .get();

    if (!adminDoc.exists) {
      throw new HttpsError("not-found", `'admin' doc doesn't exist.`);
    }
    const admins = adminDoc.data();

    if (admins.users && admins.users.includes(uid)) return;

    throw new HttpsError("permission-denied", `User is not an admin`);
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred obtaining world ${worldId}: ${err.toString()}`
    );
  }
};

const checkIsWorldOwner = async (worldId, uid) => {
  try {
    const worldDoc = await admin
      .firestore()
      .collection("worlds")
      .doc(worldId)
      .get();

    if (!worldDoc || !worldDoc.exists) {
      throw new HttpsError("not-found", `World ${worldId} does not exist`);
    }

    const world = worldDoc.data();

    if (world.owners && world.owners.includes(uid)) return;

    throw new HttpsError(
      "permission-denied",
      `User is not an owner of ${worldId}`
    );
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred obtaining world ${worldId}: ${error.toString()}`
    );
  }
};

exports.createWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  await checkIsAdmin(context.auth.token.user_id);

  const worldData = {
    name: data.name,
    config: {
      landingPageConfig: {
        coverImageUrl: data.bannerImageUrl,
        subtitle: data.subtitle ?? "",
        description: data.description ?? "",
      },
    },
    host: {
      icon: data.logoImageUrl,
    },
    owners: [context.auth.token.user_id],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const worldDoc = admin.firestore().collection("worlds").doc();
  return await worldDoc.create(worldData).then(() => worldDoc.id);
});

// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
exports.updateWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const worldId = data.id;

  if (!worldId) {
    throw new HttpsError(
      "not-found",
      `worldId is missing and the update can not be executed.`
    );
  }

  await checkIsWorldOwner(worldId, context.auth.token.user_id);
  await checkIsAdmin(context.auth.token.user_id);

  const worldData = {
    updatedAt: Date.now(),
    ...(data.bannerImageUrl && { host: { icon: data.logoImageUrl } }),
    ...(data.logoImageUrl && { host: { icon: data.logoImageUrl } }),
    ...(data.rooms && { rooms: data.rooms }),
    ...(data.code_of_conduct_questions && {
      code_of_conduct_questions: data.code_of_conduct_questions,
    }),
    ...(data.profile_questions && {
      profile_questions: data.profile_questions,
    }),
    ...(data.entrance && { entrance: data.entrance }),
  };

  if (data.bannerImageUrl || data.subtitle || data.description) {
    worldData.config = {
      landingPageConfig: {},
    };
  }

  if (typeof data.bannerImageUrl === "string") {
    worldData.config.landingPageConfig.coverImageUrl = data.bannerImageUrl;
  }

  if (typeof data.subtitle === "string") {
    worldData.config.landingPageConfig.subtitle = data.subtitle;
  }

  if (typeof data.description === "string") {
    worldData.config.landingPageConfig.description = data.description;
  }

  await admin
    .firestore()
    .collection("worlds")
    .doc(data.id)
    .set(worldData, { merge: true });

  return worldData;
});

// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
exports.deleteWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const worldId = data.id;

  await checkIsWorldOwner(worldId, context.auth.token.user_id);
  await checkIsAdmin(context.auth.token.user_id);

  admin.firestore().collection("worlds").doc(worldId).delete();
});
