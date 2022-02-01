"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v1/https");
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
        const users = admins === null || admins === void 0 ? void 0 : admins.users;
        if (Array.isArray(users) && users.includes(uid)) {
            return;
        }
        throw new https_1.HttpsError("permission-denied", `User is not an admin`);
    }
    catch (error) {
        throw new https_1.HttpsError("internal", `Error occurred checking admin ${uid}: ${error}`);
    }
};
exports.checkIsAdmin = checkIsAdmin;
//# sourceMappingURL=permissions.js.map