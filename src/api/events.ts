import firebase from "firebase/app";

import { VenueEvent } from "types/venues";

import { withId, WithId, withVenueId, WithVenueId } from "utils/id";

import { getVenueRef } from "./venue";

export const getVenueEventCollectionRef = (venueId: string) =>
  getVenueRef(venueId).collection("events");

export const fetchVenueEvents = async (
  venueId: string
): Promise<WithVenueId<WithId<VenueEvent>>[]> =>
  getVenueEventCollectionRef(venueId)
    .withConverter(venueEventWithIdConverter)
    .get()
    .then((docSnapshot) =>
      docSnapshot.docs.map((venueEvent) =>
        withVenueId(venueEvent.data(), venueId)
      )
    );
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
