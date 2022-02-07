import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { AuditoriumSeatedUser, AuditoriumSectionPath } from "types/auditorium";
import {
  CompatCollectionReference,
  CompatDocumentData,
  CompatFirestoreDataConverter,
  CompatQueryDocumentSnapshot,
} from "types/Firestore";
import { GridPosition } from "types/grid";
import { UserId } from "types/id";
import { DisplayUser, TableSeatedUser } from "types/User";
import { AnyVenue, VenueTablePath } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { pickDisplayUserFromUser } from "utils/chat";
import { WithId, withId } from "utils/id";

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
export const anyVenueWithIdConverter: CompatFirestoreDataConverter<
  WithId<AnyVenue>
> = {
  toFirestore: (anyVenue: WithId<AnyVenue>): CompatDocumentData => {
    // @debt Properly check/validate this data
    //   return AnyVenueSchema.validateSync(anyVenue);

    return anyVenue;
  },

  fromFirestore: (
    snapshot: CompatQueryDocumentSnapshot<AnyVenue>
  ): WithId<AnyVenue> => {
    // @debt Properly check/validate this data rather than using 'as'
    //   return withId(AnyVenueSchema.validateSync(snapshot.data(), snapshot.id);

    return withId(snapshot.data() as AnyVenue, snapshot.id);
  },
};

export const updateIframeUrl = async (iframeUrl: string, venueId?: string) => {
  if (!venueId) return;

  return httpsCallable(
    FIREBASE.functions,
    "venue-adminUpdateIframeUrl"
  )({ venueId, iframeUrl });
};

type VenueInputForm = Partial<WithId<AnyVenue>> & {
  bannerImageUrl?: string;
  bannerImageFile?: FileList;
  logoImageUrl?: string;
  logoImageFile?: FileList;
  numberOfSections?: number;
};

export const updateVenueNG = async (venue: VenueInputForm, userId: UserId) => {
  const bannerFile = venue.bannerImageFile?.[0];
  const logoFile = venue.logoImageFile?.[0];

  if (bannerFile) {
    const fileExtension = bannerFile.name.split(".").pop();
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${userId}/venues/${venue.id}/bannerImage.${fileExtension}`
    );
    await uploadBytes(uploadFileRef, bannerFile);
    const downloadUrl = await getDownloadURL(uploadFileRef);
    venue.bannerImageUrl = downloadUrl;
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

const getUserInSectionRef = (userId: string, path: AuditoriumSectionPath) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(path.venueId)
    .collection("sections")
    .doc(path.sectionId)
    .collection("seatedSectionUsers")
    .doc(userId);

const getUserSeatedTableRef = (userId: string, venueId: string) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("seatedTableUsers")
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
  const seatedUserData: AuditoriumSeatedUser = {
    ...pickDisplayUserFromUser(user),
    position,
    path,
  };

  return getUserInSectionRef(user.id, path)
    .set(seatedUserData)
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

export const setTableSeat = async (
  user: WithId<DisplayUser>,
  path: VenueTablePath
) => {
  const data: TableSeatedUser = {
    ...pickDisplayUserFromUser(user),
    path,
  };
  return getUserSeatedTableRef(user.id, path.venueId).set(data);
};

export const unsetTableSeat = async (
  userId: string,
  { venueId }: Pick<VenueTablePath, "venueId">
) => getUserSeatedTableRef(userId, venueId).delete();
