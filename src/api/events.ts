import firebase from "firebase/app";

import { COLLECTION_WORLD_EVENTS } from "settings";

import { WorldExperience } from "types/venues";

import { WithId, withId, WithVenueId, withVenueId } from "utils/id";
import { asArray } from "utils/types";

export const getWorldEventsCollectionRef = () =>
  firebase.firestore().collection(COLLECTION_WORLD_EVENTS);

export const fetchSpaceEvents = async (
  worldId: string,
  spaceId: string
): Promise<WithVenueId<WithId<WorldExperience>>[]> =>
  getWorldEventsCollectionRef()
    .where("worldId", "==", worldId)
    .where("spaceId", "==", spaceId)
    .withConverter(spaceEventWithIdConverter)
    .get()
    .then((docSnapshot) =>
      docSnapshot.docs.map((spaceEvent) =>
        withVenueId(spaceEvent.data(), spaceId)
      )
    );

export const fetchAllSpaceEvents = async (
  worldId: string,
  spaceIdOrIds: string | string[]
): Promise<WithVenueId<WithId<WorldExperience>>[]> =>
  // TODO Refactor to fetch all world events, probably. Or offer it so caller can use it.
  Promise.all(
    asArray(spaceIdOrIds).map((spaceId) => fetchSpaceEvents(worldId, spaceId))
  ).then((result) => {
    const flattened = result.flat();
    flattened.sort((a, b) => a.startUtcSeconds - b.startUtcSeconds);
    return flattened;
  });

/**
 * Convert Experience objects between the app/firestore formats (@debt:, including validation).
 */
export const spaceEventWithIdConverter: firebase.firestore.FirestoreDataConverter<
  WithId<WorldExperience>
> = {
  toFirestore: (
    spaceEvent: WithId<WorldExperience>
  ): firebase.firestore.DocumentData => {
    // @debt Properly check/validate this data
    //   return VenueEventSchema.validateSync(venueEvent);

    return spaceEvent;
  },

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<WorldExperience> => {
    // @debt Properly check/validate this data rather than using 'as'
    //   return withId(VenueEventSchema.validateSync(snapshot.data(), snapshot.id);

    return withId(snapshot.data() as WorldExperience, snapshot.id);
  },
};
