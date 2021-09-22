import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { AuditoriumSectionPath } from "types/auditorium";
import { GridPosition } from "types/grid";
import { AuditoriumSeatedUser, DisplayUser } from "types/User";
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

const getUserInSectionRef = (userId: string, path: AuditoriumSectionPath) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(path.venueId)
    .collection("sections")
    .doc(path.sectionId)
    .collection("seatedSectionUsers")
    .doc(userId);

export const unsetAuditoriumSectionSeat = async (
  userId: string,
  path: AuditoriumSectionPath
) => {
  return getUserInSectionRef(userId, path)
    .delete()
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::unsetAuditoriumSectionSeat",
          venueId: path.venueId,
          sectionId: path.sectionId,
          userId,
        });
      });

      throw err;
    });
};

export const setAuditoriumSectionSeat = async (
  user: WithId<DisplayUser>,
  position: GridPosition,
  path: AuditoriumSectionPath
) => {
  const data: AuditoriumSeatedUser = {
    ...pickDisplayUserFromUser(user),
    position,
    path,
  };

  return getUserInSectionRef(user.id, path)
    .set(data)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::setAuditoriumSectionSeat",
          venueId: path.venueId,
          sectionId: path.sectionId,
          user,
        });
      });

      throw err;
    });
};
