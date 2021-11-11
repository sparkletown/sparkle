const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { checkAuth } = require("./src/utils/assert");

const { isNil, isEmpty } = require("lodash");

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

    if (admins.users && admins.users.includes(uid)) {
      return;
    }

    throw new HttpsError("permission-denied", `User is not an admin`);
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred obtaining world ${worldId}: ${error.toString()}`
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

    if (world.owners && world.owners.includes(uid)) {
      return;
    }

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
    slug: data.slug,
    config: {
      landingPageConfig: {
        coverImageUrl: data.bannerImageUrl || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
      },
    },
    host: {
      icon: data.logoImageUrl || "",
    },
    owners: [context.auth.token.user_id],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const worldDoc = admin.firestore().collection("worlds").doc();
  return await worldDoc.create(worldData).then(() => worldDoc.id);
});

exports.updateWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const {
    adultContent,
    attendeesTitle,
    bannerImageUrl,
    chatTitle,
    description,
    entrance,
    id: worldId,
    logoImageUrl,
    name,
    questions,
    requiresDateOfBirth,
    rooms,
    showNametags,
    showBadges,
    showUserStatus,
    slug,
    subtitle,
    showSchedule,
    userStatuses,
  } = data;

  if (!worldId) {
    throw new HttpsError(
      "not-found",
      `World Id is missing and the update can not be executed.`
    );
  }

  await checkIsWorldOwner(worldId, context.auth.token.user_id);
  await checkIsAdmin(context.auth.token.user_id);

  let landingPageConfig;
  if (bannerImageUrl || subtitle || description) {
    landingPageConfig = {};
    if (typeof bannerImageUrl === "string") {
      landingPageConfig.coverImageUrl = bannerImageUrl;
    }

    if (typeof subtitle === "string") {
      landingPageConfig.subtitle = subtitle;
    }

    if (typeof description === "string") {
      landingPageConfig.description = description;
    }
  }

  const questionsConfig = {
    code: (questions && questions.code) || [],
    profile: (questions && questions.profile) || [],
  };

  const worldData = {
    updatedAt: Date.now(),
    ...(!isNil(adultContent) && { adultContent }),
    ...(!isNil(attendeesTitle) && { attendeesTitle }),
    ...(!isNil(chatTitle) && { chatTitle }),
    ...(!isNil(entrance) && { entrance }),
    ...(!isNil(landingPageConfig) && { config: { landingPageConfig } }),
    ...(!isNil(logoImageUrl) && { host: { icon: logoImageUrl } }),
    ...(!isNil(name) && { name }),
    ...(!isEmpty(questions) && { questions: questionsConfig }),
    ...(!isNil(requiresDateOfBirth) && { requiresDateOfBirth }),
    ...(!isNil(rooms) && { rooms }),
    ...(!isNil(showNametags) && { showNametags }),
    ...{ showSchedule: isNil(showSchedule) ? true : showSchedule },
    ...(!isEmpty(userStatuses) && { userStatuses }),
    ...(!isNil(showUserStatus) && { showUserStatus }),
    ...(!isNil(slug) && { slug }),
    ...(!isNil(showBadges) && { showBadges }),
  };

  await admin
    .firestore()
    .collection("worlds")
    .doc(worldId)
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
