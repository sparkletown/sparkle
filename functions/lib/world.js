"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorld = exports.updateWorld = exports.createWorld = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const lodash_1 = require("lodash");
const assert_1 = require("./utils/assert");
const checkIsAdmin = async (uid) => {
    try {
        const adminDoc = await admin
            .firestore()
            .collection("roles")
            .doc("admin")
            .get();
        if (!adminDoc.exists) {
            throw new https_1.HttpsError("not-found", `'admin' doc doesn't exist.`);
        }
        const admins = adminDoc.data();
        if (!admins) {
            throw new https_1.HttpsError("not-found", "data not found");
        }
        if (admins.users && admins.users.includes(uid)) {
            return;
        }
        throw new https_1.HttpsError("permission-denied", `User is not an admin`);
    }
    catch (error) {
        throw new https_1.HttpsError("internal", `Error occurred checking admin ${uid}: ${error}`);
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
            throw new https_1.HttpsError("not-found", `World ${worldId} does not exist`);
        }
        const world = worldDoc.data();
        if (!world) {
            throw new https_1.HttpsError("internal", "Data not found");
        }
        if (world.owners && world.owners.includes(uid)) {
            return;
        }
        throw new https_1.HttpsError("permission-denied", `User is not an owner of ${worldId}`);
    }
    catch (error) {
        throw new https_1.HttpsError("internal", `Error occurred obtaining world ${worldId}: ${error}`);
    }
};
exports.createWorld = functions.https.onCall(async (data, context) => {
    var _a, _b;
    (0, assert_1.assertValidAuth)(context);
    await checkIsAdmin((_a = context.auth) === null || _a === void 0 ? void 0 : _a.token.user_id);
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
        owners: [(_b = context.auth) === null || _b === void 0 ? void 0 : _b.token.user_id],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isHidden: false,
    };
    const worldDoc = admin.firestore().collection("worlds").doc();
    return await worldDoc
        .create(worldData)
        .then(() => (Object.assign(Object.assign({}, worldData), { id: worldDoc.id })));
});
exports.updateWorld = functions.https.onCall(async (data, context) => {
    var _a, _b;
    (0, assert_1.assertValidAuth)(context);
    const { adultContent, attendeesTitle, bannerImageUrl, description, entrance, id: worldId, logoImageUrl, name, questions, radioStations, requiresDateOfBirth, rooms, showBadges, showRadio, showUserStatus, slug, subtitle, showSchedule, userStatuses, hasSocialLoginEnabled, } = data;
    if (!worldId) {
        throw new https_1.HttpsError("not-found", `World Id is missing and the update can not be executed.`);
    }
    await checkIsWorldOwner(worldId, (_a = context.auth) === null || _a === void 0 ? void 0 : _a.token.user_id);
    await checkIsAdmin((_b = context.auth) === null || _b === void 0 ? void 0 : _b.token.user_id);
    let landingPageConfig = undefined;
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
    const worldData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ updatedAt: Date.now() }, (!(0, lodash_1.isNil)(adultContent) && { adultContent })), (!(0, lodash_1.isNil)(attendeesTitle) && { attendeesTitle })), (!(0, lodash_1.isNil)(entrance) && { entrance })), (!(0, lodash_1.isNil)(landingPageConfig) && { config: { landingPageConfig } })), (!(0, lodash_1.isNil)(logoImageUrl) && { host: { icon: logoImageUrl } })), (!(0, lodash_1.isNil)(name) && { name })), (!(0, lodash_1.isEmpty)(questions) && { questions: questionsConfig })), (!(0, lodash_1.isNil)(radioStations) && { radioStations })), (!(0, lodash_1.isNil)(requiresDateOfBirth) && { requiresDateOfBirth })), (!(0, lodash_1.isNil)(rooms) && { rooms })), (!(0, lodash_1.isNil)(showRadio) && { showRadio })), { showSchedule: (0, lodash_1.isNil)(showSchedule) ? true : showSchedule }), (!(0, lodash_1.isNil)(userStatuses) && { userStatuses })), (!(0, lodash_1.isNil)(showUserStatus) && { showUserStatus })), (!(0, lodash_1.isNil)(slug) && { slug })), (!(0, lodash_1.isNil)(showBadges) && { showBadges })), (!(0, lodash_1.isNil)(hasSocialLoginEnabled) && { hasSocialLoginEnabled }));
    await admin
        .firestore()
        .collection("worlds")
        .doc(worldId)
        .set(worldData, { merge: true });
    return worldData;
});
// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
exports.deleteWorld = functions.https.onCall(async (data, context) => {
    var _a, _b;
    (0, assert_1.assertValidAuth)(context);
    const worldId = data.id;
    await checkIsWorldOwner(worldId, (_a = context.auth) === null || _a === void 0 ? void 0 : _a.token.user_id);
    await checkIsAdmin((_b = context.auth) === null || _b === void 0 ? void 0 : _b.token.user_id);
    admin.firestore().collection("worlds").doc(worldId).delete();
});
//# sourceMappingURL=world.js.map