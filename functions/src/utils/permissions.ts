import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

export const throwErrorIfNotMasterAdmin = async (uid: string) => {
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

const checkIfSpaceOwner = async ({
  spaceId,
  uid,
}: {
  spaceId: string;
  uid: string;
}): Promise<boolean> => {
  return await admin
    .firestore()
    .collection("venues")
    .doc(spaceId)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        throw new HttpsError("not-found", `Venue ${spaceId} does not exist`);
      }
      const venue = doc.data();

      if (!venue) {
        throw new HttpsError("internal", "No data returned");
      }
      if (venue.owners && venue.owners.includes(uid)) return true;

      if (venue.parentId) {
        const doc = await admin
          .firestore()
          .collection("venues")
          .doc(venue.parentId)
          .get();

        if (!doc.exists) {
          throw new HttpsError(
            "not-found",
            `Venue ${spaceId} references missing parent ${venue.parentId}`
          );
        }
        const parentVenue = doc.data();

        if (!parentVenue) {
          throw new HttpsError("internal", "No data returned");
        }
        if (parentVenue.owners && parentVenue.owners.includes(uid)) return true;

        return false;
      }

      return false;
    })
    .catch((err) => {
      throw new HttpsError(
        "internal",
        `Error occurred obtaining venue ${spaceId}: ${err.toString()}`
      );
    });
};

export const throwErrorIfNotSpaceOwner = async ({
  spaceId,
  uid,
}: {
  spaceId: string;
  uid: string;
}) => {
  const isSpaceOwner = await checkIfSpaceOwner({ spaceId, uid });

  if (!isSpaceOwner) {
    throw new HttpsError(
      "permission-denied",
      `User is not an owner of ${spaceId} nor its parent`
    );
  }
};

const checkIfWorldOwner = async ({
  worldId,
  uid,
}: {
  worldId: string;
  uid: string;
}) => {
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
      return true;
    }

    return false;
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred obtaining world ${worldId}: ${error}`
    );
  }
};

export const throwErrorIfNotWorldOwner = async ({
  worldId,
  uid,
}: {
  worldId: string;
  uid: string;
}) => {
  const isWorldOwner = await checkIfWorldOwner({ worldId, uid });

  if (!isWorldOwner) {
    throw new HttpsError(
      "permission-denied",
      `User is not an owner of ${worldId}`
    );
  }
};

export const throwErrorIfNeitherWorldNorSpaceOwner = async ({
  worldId,
  spaceId,
  uid,
}: {
  worldId: string;
  spaceId: string;
  uid: string;
}) => {
  console.log("I'm inside");
  const isWorldOwner = await checkIfWorldOwner({ worldId, uid });
  const isSpaceOwner = await checkIfSpaceOwner({ spaceId, uid });

  if (!isWorldOwner && !isSpaceOwner) {
    throw new HttpsError(
      "permission-denied",
      `User is not an owner neither of ${worldId} nor he's an owner of ${spaceId}`
    );
  }
};
