import * as admin from "firebase-admin";

/** Remove a user from the list of admins
 *
 * @param {string} adminId
 */
export const removeAdmin = async (adminId: string) => {
  await admin
    .firestore()
    .collection("roles")
    .doc("admin")
    .update({
      users: admin.firestore.FieldValue.arrayRemove(adminId),
    });
};

/** Add a user to the list of admins
 *
 * @param {string} newAdminId
 */
export const addAdmin = async (newAdminId: string) => {
  await admin
    .firestore()
    .collection("roles")
    .doc("admin")
    .update({
      users: admin.firestore.FieldValue.arrayUnion(newAdminId),
    });
};
