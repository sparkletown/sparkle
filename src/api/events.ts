import firebase from "firebase/app";

import { VenueEvent } from "types/venues";

import { withId, WithId, WithVenueId } from "utils/id";

export const fetchAllVenueEvents = async (
  sovereignVenueId: string
): Promise<WithVenueId<WithId<VenueEvent>>[]> => {
  const eventsSnapshot = await firebase
    .firestore()
    .collectionGroup("events")
    .where("sovereignVenueId", "==", sovereignVenueId)
    .withConverter(venueEventWithIdConverter)
    .get();

  return eventsSnapshot.docs
    .map((venueEvent) => venueEvent.data())
    .filter((venueEvent) => venueEvent.venueId) as WithVenueId<
    WithId<VenueEvent>
  >[];
};

/**
 * Convert VenueEvent objects between the app/firestore formats (@debt:, including validation).
 */
export const venueEventWithIdConverter: firebase.firestore.FirestoreDataConverter<
  WithId<VenueEvent>
> = {
  toFirestore: (
    venueEvent: WithId<VenueEvent>
  ): firebase.firestore.DocumentData => {
    // @debt Properly check/validate this data
    //   return VenueEventSchema.validateSync(venueEvent);

    return venueEvent;
  },

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<VenueEvent> => {
    // @debt Properly check/validate this data rather than using 'as'
    //   return withId(VenueEventSchema.validateSync(snapshot.data(), snapshot.id);

    return withId(snapshot.data() as VenueEvent, snapshot.id);
  },
};
