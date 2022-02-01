"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdmin = exports.removeAdmin = void 0;
const admin = require("firebase-admin");
/** Remove a user from the list of admins
 *
 * @param {string} adminId
 */
const removeAdmin = async (adminId) => {
    await admin
        .firestore()
        .collection("roles")
        .doc("admin")
        .update({
        users: admin.firestore.FieldValue.arrayRemove(adminId),
    });
};
exports.removeAdmin = removeAdmin;
/** Add a user to the list of admins
 *
 * @param {string} newAdminId
 */
const addAdmin = async (newAdminId) => {
    await admin
        .firestore()
        .collection("roles")
        .doc("admin")
        .update({
        users: admin.firestore.FieldValue.arrayUnion(newAdminId),
    });
};
exports.addAdmin = addAdmin;
//# sourceMappingURL=roles.js.map