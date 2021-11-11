import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { AuditoriumSeatedUser, AuditoriumSectionPath } from "types/auditorium";
import { GridPosition } from "types/grid";
import { DisplayUser, TableSeatedUser } from "types/User";
import { AnyVenue, VenueTablePath, VenueTemplate } from "types/venues";

import { pickDisplayUserFromUser } from "utils/chat";
import { WithId, withId } from "utils/id";

export const getVenueCollectionRef = () =>
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
  bannerImageUrl?: string;
  mapBackgroundImage_url?: string;
  mapBackgroundImage_file?: FileList;
  numberOfSections?: number;
};

export const checkSpaceExistsInWorld = async (
  slug: string,
  worldId: string
) => {
  return !!(
    await firebase
      .firestore()
      .collection("venues")
      .where("slug", "==", slug)
      .where("worldId", "==", worldId)
      .get()
  ).docs.length;
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

  const updateResponse = await firebase
    .functions()
    .httpsCallable("venue-updateVenueNG")(venue);

  if (venue.template === VenueTemplate.auditorium) {
    await firebase.functions().httpsCallable("venue-setAuditoriumSections")({
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
