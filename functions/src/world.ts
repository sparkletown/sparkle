import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { isEmpty, isNil } from "lodash";

import { LandingPageConfig } from "./types/venue";
import { assertValidAuth } from "./utils/assert";

const checkIsAdmin = async (uid: string) => {
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
    if (!admins) {
      throw new HttpsError("not-found", "data not found");
    }

    if (admins.users && admins.users.includes(uid)) {
      return;
    }

    throw new HttpsError("permission-denied", `User is not an admin`);
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred checking admin ${uid}: ${error}`
    );
  }
};

const checkIsWorldOwner = async (worldId: string, uid: string) => {
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
    if (!world) {
      throw new HttpsError("internal", "Data not found");
    }

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
      `Error occurred obtaining world ${worldId}: ${error}`
    );
  }
};

export const createWorld = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  await checkIsAdmin(context.auth?.token.user_id);

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
    owners: [context.auth?.token.user_id],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isHidden: false,
  };

  const worldDoc = admin.firestore().collection("worlds").doc();
  return await worldDoc
    .create(worldData)
    .then(() => ({ ...worldData, id: worldDoc.id }));
});

export const updateWorld = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const {
    adultContent,
    attendeesTitle,
    bannerImageUrl,
    description,
    entrance,
    id: worldId,
    logoImageUrl,
    name,
    questions,
    radioStations,
    requiresDateOfBirth,
    rooms,
    showBadges,
    showRadio,
    showUserStatus,
    slug,
    subtitle,
    showSchedule,
    userStatuses,
    hasSocialLoginEnabled,
  } = data;

  if (!worldId) {
    throw new HttpsError(
      "not-found",
      `World Id is missing and the update can not be executed.`
    );
  }

  await checkIsWorldOwner(worldId, context.auth?.token.user_id);
  await checkIsAdmin(context.auth?.token.user_id);

  let landingPageConfig: LandingPageConfig | undefined = undefined;
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
    ...(!isNil(entrance) && { entrance }),
    ...(!isNil(landingPageConfig) && { config: { landingPageConfig } }),
    ...(!isNil(logoImageUrl) && { host: { icon: logoImageUrl } }),
    ...(!isNil(name) && { name }),
    ...(!isEmpty(questions) && { questions: questionsConfig }),
    ...(!isNil(radioStations) && { radioStations }),
    ...(!isNil(requiresDateOfBirth) && { requiresDateOfBirth }),
    ...(!isNil(rooms) && { rooms }),
    ...(!isNil(showRadio) && { showRadio }),
    ...{ showSchedule: isNil(showSchedule) ? true : showSchedule },
    ...(!isNil(userStatuses) && { userStatuses }),
    ...(!isNil(showUserStatus) && { showUserStatus }),
    ...(!isNil(slug) && { slug }),
    ...(!isNil(showBadges) && { showBadges }),
    ...(!isNil(hasSocialLoginEnabled) && { hasSocialLoginEnabled }),
  };

  await admin
    .firestore()
    .collection("worlds")
    .doc(worldId)
    .set(worldData, { merge: true });

  return worldData;
});

// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
export const deleteWorld = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const worldId = data.id;

  await checkIsWorldOwner(worldId, context.auth?.token.user_id);
  await checkIsAdmin(context.auth?.token.user_id);

  admin.firestore().collection("worlds").doc(worldId).delete();
});