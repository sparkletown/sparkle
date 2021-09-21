import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { DisplayUser } from "types/User";
import { AnyVenue } from "types/venues";

import { pickDisplayUserFromUser } from "utils/chat";
import { WithId, withId } from "utils/id";

export const getVenueCollectionRef = () =>
  firebase.firestore().collection("venues");

export const getVenueRef = (venueId: string) =>
  getVenueCollectionRef().doc(venueId);

export interface SetVenueLiveStatusProps {
  venueId: string;
  isLive: boolean;
  onError?: (msg: string) => void;
  onFinish?: () => void;
}

export const setVenueLiveStatus = async ({
  venueId,
  isLive,
  onError,
  onFinish,
}: SetVenueLiveStatusProps): Promise<void | firebase.functions.HttpsCallableResult> => {
  const params = {
    isLive,
    venueId,
  };

  return firebase
    .functions()
    .httpsCallable("venue-setVenueLiveStatus")(params)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::setVenueLiveStatus",
          venueId,
        });
      });

      if (onError) onError(err);
    })
    .finally(onFinish);
};

/**
 * Convert Venue objects between the app/firestore formats (@debt:, including validation).
 */
export const anyVenueWithIdConverter: firebase.firestore.FirestoreDataConverter<
  WithId<AnyVenue>
> = {
  toFirestore: (
    anyVenue: WithId<AnyVenue>
  ): firebase.firestore.DocumentData => {
    // @debt Properly check/validate this data
    //   return AnyVenueSchema.validateSync(anyVenue);

    return anyVenue;
  },

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<AnyVenue> => {
    // @debt Properly check/validate this data rather than using 'as'
    //   return withId(AnyVenueSchema.validateSync(snapshot.data(), snapshot.id);

    return withId(snapshot.data() as AnyVenue, snapshot.id);
  },
};

export const updateIframeUrl = async (iframeUrl: string, venueId?: string) => {
  if (!venueId) return;

  return await firebase
    .functions()
    .httpsCallable("venue-adminUpdateIframeUrl")({ venueId, iframeUrl });
};

const getUserInSectionRef = (
  userId: string,
  venueId: string,
  sectionId: string
) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("sections")
    .doc(sectionId)
    .collection("seatedUsers")
    .doc(userId);

export const unsetAuditoriumSectionSeat = async (
  userId: string,
  venueId: string,
  sectionId: string
) => {
  return getUserInSectionRef(userId, venueId, sectionId)
    .delete()
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::unsetAuditoriumSectionSeat",
          venueId,
          sectionId,
          userId,
        });
      });

      throw err;
    });
};

export const setAuditoriumSectionSeat = async (
  user: WithId<DisplayUser>,
  venueId: string,
  sectionId: string,
  row: number,
  column: number
) => {
  return getUserInSectionRef(user.id, venueId, sectionId)
    .set({
      ...pickDisplayUserFromUser(user),
      row,
      column,
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::setAuditoriumSectionSeat",
          venueId,
          sectionId,
          user,
        });
      });

      throw err;
    });
};
