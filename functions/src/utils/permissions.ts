import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

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
    const users = admins?.users;

    if (Array.isArray(users) && users.includes(uid)) {
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

exports.checkIsAdmin = checkIsAdmin;
