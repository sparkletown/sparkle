import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import {
  CompatCollectionReference,
  CompatDocumentData,
  CompatFirestoreDataConverter,
  CompatQueryDocumentSnapshot,
} from "types/Firestore";
import { SpaceId, SpaceWithId, UserId } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { withId } from "utils/id";

export const getVenueCollectionRef: () => CompatCollectionReference<CompatDocumentData> = () =>
  firebase.firestore().collection("venues");

export const getVenueRef = (venueId: string) =>
  getVenueCollectionRef().doc(venueId);

export const fetchVenue = async (venueId: string) => {
  const venueDoc = await getVenueRef(venueId).get();
  return venueDoc.data() as AnyVenue;
};

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
}: SetVenueLiveStatusProps): Promise<void | HttpsCallableResult> => {
  const params = {
    isLive,
    venueId,
  };

  return httpsCallable(
    FIREBASE.functions,
    "venue-setVenueLiveStatus"
  )(params)
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
export const anyVenueWithIdConverter: CompatFirestoreDataConverter<SpaceWithId> = {
  toFirestore: (anyVenue: SpaceWithId): CompatDocumentData => {
    // @debt Properly check/validate this data
    //   return AnyVenueSchema.validateSync(anyVenue);

    return anyVenue;
  },

  fromFirestore: (
    snapshot: CompatQueryDocumentSnapshot<AnyVenue>
  ): SpaceWithId => {
    // @debt Properly check/validate this data rather than using 'as'
    //   return withId(AnyVenueSchema.validateSync(snapshot.data(), snapshot.id);

    return withId<AnyVenue, SpaceId>(
      snapshot.data() as AnyVenue,
      snapshot.id as SpaceId
    );
  },
};

export const updateIframeUrl = async (iframeUrl: string, venueId?: string) => {
  if (!venueId) return;

  return httpsCallable(
    FIREBASE.functions,
    "venue-adminUpdateIframeUrl"
  )({ venueId, iframeUrl });
};

type VenueInputForm = Partial<SpaceWithId> & {
  backgroundImageUrl?: string;
  backgroundImageFile?: FileList;
  logoImageUrl?: string;
  logoImageFile?: FileList;
  numberOfSections?: number;
};

export const updateVenueNG = async (venue: VenueInputForm, userId: UserId) => {
  const backgroundFile = venue.backgroundImageFile?.[0];
  const logoFile = venue.logoImageFile?.[0];

  if (backgroundFile) {
    const fileExtension = backgroundFile.name.split(".").pop();
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${userId}/venues/${venue.id}/backgroundImage.${fileExtension}`
    );
    await uploadBytes(uploadFileRef, backgroundFile);
    const downloadUrl = await getDownloadURL(uploadFileRef);
    venue.backgroundImageUrl = downloadUrl;
  }

  if (logoFile) {
    const fileExtension = logoFile.name.split(".").pop();
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${userId}/venues/${venue.id}/logoImage.${fileExtension}`
    );
    await uploadBytes(uploadFileRef, logoFile);
    const downloadUrl = await getDownloadURL(uploadFileRef);
    venue.logoImageUrl = downloadUrl;
  }

  const updateResponse = await httpsCallable(
    FIREBASE.functions,
    "venue-updateVenueNG"
  )(venue);

  if (venue.template === VenueTemplate.auditorium) {
    await httpsCallable(
      FIREBASE.functions,
      "venue-setAuditoriumSections"
    )({
      venueId: venue.id,
      numberOfSections: venue.numberOfSections,
    });
  }

  return updateResponse;
};
