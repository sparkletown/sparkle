import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

export const throwErrorIfNotSuperAdmin = async (userId: string) => {
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

    if (Array.isArray(users) && users.includes(userId)) {
      return;
    }

    throw new HttpsError("permission-denied", `User is not an admin`);
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Error occurred checking admin ${userId}: ${error}`
    );
  }
};

const checkIfSpaceOwner = async ({
  spaceId,
  userId,
}: {
  spaceId: string;
  userId: string;
}): Promise<boolean> => {
  return admin
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
      if (venue.owners && venue.owners.includes(userId)) return true;

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
  userId,
}: {
  spaceId: string;
  userId: string;
}) => {
  const isSpaceOwner = await checkIfSpaceOwner({ spaceId, userId });

  if (!isSpaceOwner) {
    throw new HttpsError(
      "permission-denied",
      `User is not an owner of ${spaceId} space`
    );
  }
};

const checkIfWorldOwner = async ({
  worldId,
  userId,
}: {
  worldId: string;
  userId: string;
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

    if (world.owners && world.owners.includes(userId)) {
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
  userId,
}: {
  worldId: string;
  userId: string;
}) => {
  const isWorldOwner = await checkIfWorldOwner({ worldId, userId });

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
  userId,
}: {
  worldId: string;
  spaceId: string;
  userId: string;
}) => {
  const isWorldOwner = await checkIfWorldOwner({ worldId, userId });
  const isSpaceOwner = await checkIfSpaceOwner({ spaceId, userId });

  if (!isWorldOwner && !isSpaceOwner) {
    throw new HttpsError(
      "permission-denied",
      `User is not an owner neither of ${worldId} world nor he's an owner of ${spaceId} space`
    );
  }
};
