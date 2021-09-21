import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

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

type VenueInputForm = Partial<WithId<AnyVenue>> & {
  mapBackgroundImage_url?: string;
  mapBackgroundImage_file?: FileList;
};

export const updateVenueNG = async (
  venue: VenueInputForm,
  user: firebase.UserInfo
) => {
  const file = venue.mapBackgroundImage_file?.[0];
  if (file) {
    const storageRef = firebase.storage().ref();
    const fileExtension = file.name.split(".").pop();
    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${venue.id}/mapBackground.${fileExtension}`
    );
    await uploadFileRef.put(file);
    const downloadUrl = await uploadFileRef.getDownloadURL();
    venue.mapBackgroundImageUrl = downloadUrl;
  }

  return await firebase.functions().httpsCallable("venue-updateVenueNG")(venue);
};
