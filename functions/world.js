const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { checkAuth } = require("./src/utils/assert");

const { isNil } = require("lodash");

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
    const worldsData = await admin
      .firestore()
      .collection("worlds")
      .where("slug", "==", worldId ?? "")
      .get();

    const hasWorldDoc = Boolean(worldsData.docs.length);

    if (!hasWorldDoc) {
      throw new HttpsError("not-found", `World ${worldId} does not exist`);
    }

    const world = worldsData.docs[0].data();

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

  const { docs } = await admin
    .firestore()
    .collection("worlds")
    .where("slug", "==", data.slug)
    .get();

  const slugExists = docs.length;

  if (slugExists) {
    throw new HttpsError(
      "already-exists",
      `The world slug '${data.slug}' already belongs to another world, please try again with another slug.`
    );
  }

  const worldDoc = admin.firestore().collection("worlds").doc();
  return await worldDoc.create(worldData).then(() => worldData);
});

exports.updateWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const {
    attendeesTitle,
    bannerImageUrl,
    chatTitle,
    code_of_conduct_questions,
    description,
    entrance,
    id: worldId,
    logoImageUrl,
    name,
    profile_questions,
    rooms,
    showNametags,
    showBadges,
    slug,
    subtitle,
  } = data;

  if (!worldId) {
    throw new HttpsError(
      "not-found",
      `World id is missing and the update can not be executed.`
    );
  }

  const { docs } = await admin
    .firestore()
    .collection("worlds")
    .where("slug", "==", worldId)
    .get();

  const hasWorld = docs.length;

  if (!hasWorld) {
    throw new HttpsError(
      "not-found",
      `World with the slug ${worldId} does not exist.`
    );
  }

  const world = docs[0].data();

  await checkIsWorldOwner(slug, context.auth.token.user_id);
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

  const worldData = {
    ...world,
    updatedAt: Date.now(),
    ...(!isNil(attendeesTitle) && { attendeesTitle }),
    ...(!isNil(chatTitle) && { chatTitle }),
    ...(!isNil(code_of_conduct_questions) && { code_of_conduct_questions }),
    ...(!isNil(entrance) && { entrance }),
    ...(!isNil(landingPageConfig) && { config: { landingPageConfig } }),
    ...(!isNil(logoImageUrl) && { host: { icon: logoImageUrl } }),
    ...(!isNil(name) && { name }),
    ...(!isNil(profile_questions) && { profile_questions }),
    ...(!isNil(rooms) && { rooms }),
    ...(!isNil(showNametags) && { showNametags }),
    ...(!isNil(slug) && { slug }),
    ...(!isNil(showBadges) && { showBadges }),
  };

  await docs[0].ref.set(worldData);
  return worldData;
});

// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
exports.deleteWorld = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const worldId = data.id;

  await checkIsWorldOwner(worldId, context.auth.token.user_id);
  await checkIsAdmin(context.auth.token.user_id);

  const { docs } = await admin
    .firestore()
    .collection("worlds")
    .where("slug", "==", worldId)
    .get();

  const hasWorld = docs.length;

  if (!hasWorld) {
    throw new HttpsError(
      "not-found",
      `World with the slug ${worldId} does not exist.`
    );
  }

  await docs[0].ref.delete();
});
