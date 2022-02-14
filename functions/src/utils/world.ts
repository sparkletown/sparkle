import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

type GetWorldBySlugProps = {
  worldSlug: string;
};

export const getWorldBySlug = async ({ worldSlug }: GetWorldBySlugProps) => {
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
