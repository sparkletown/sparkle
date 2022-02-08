import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

export const checkIsAdmin = async (uid: string) => {
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

export const checkIsWorldOwner = async (worldId: string, uid: string) => {
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

exports.checkIsAdmin = checkIsAdmin;
