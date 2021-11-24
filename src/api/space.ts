// NOTE: use this space.ts for new API while moving the still useful ones from venue.ts to this place

import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { COLLECTION_SPACES, FIELD_SLUG, FIELD_WORLD_ID } from "settings";

import { findWorldBySlug } from "api/world";

export type FindSpaceBySlugOptions = {
  spaceSlug: string;
  worldId?: string;
  worldSlug?: string;
};

export const findSpaceBySlug = async ({
  spaceSlug,
  worldId,
  worldSlug,
}: FindSpaceBySlugOptions) => {
  if (!spaceSlug) {
    throw new Error("The spaceSlug should be provided");
  }

  let query: firebase.firestore.Query = firebase
    .firestore()
    .collection(COLLECTION_SPACES)
    .where(FIELD_SLUG, "==", spaceSlug);

  if (worldId) {
    query = query.where(FIELD_WORLD_ID, "==", worldId);
  }

  if (!worldId && worldSlug) {
    // NOTE: if spaces have worldSlug alongside worldId, this would be simpler
    const world = await findWorldBySlug({ worldSlug });
    query = query.where(FIELD_WORLD_ID, "==", world?.id);
  }

  if (!worldId && !worldSlug) {
    throw new Error("At least one of worldId or worldSlug should be provided");
  }

  const spacesRef = await query.get();

  const spaces = spacesRef.docs;

  if (spaces.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("api/world::findSpaceBySlug", {
          worldSlug,
          spaceSlug,
          spaces,
        });
      }
    );
  }

  return spaces?.[0];
};
