import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

type GetWorldBySlugOptions = {
  worldSlug: string;
};

export const getWorldBySlug = async ({ worldSlug }: GetWorldBySlugOptions) => {
  const matchingWorlds = await admin
    .firestore()
    .collection("worlds")
    .where("slug", "==", worldSlug)
    .get();

  if (matchingWorlds.empty) {
    throw new HttpsError(
      "internal",
      `The world with ${worldSlug} does not exist`
    );
  }

  const [world] = matchingWorlds.docs;
  return world;
};
