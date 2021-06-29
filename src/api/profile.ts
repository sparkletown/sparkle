import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";
import { ProfileLink, UserStatus } from "types/User";

import { VenueEvent } from "types/venues";
import { AnyGridData } from "types/grid";

import { WithVenueId } from "utils/id";

export const getUserRef = (userId: string) =>
  firebase.firestore().collection("users").doc(userId);

export interface MakeUpdateUserGridLocationProps {
  venueId: string;
  userUid: string;
}

/** @deprecated use setGridData instead **/
export const makeUpdateUserGridLocation = ({
  venueId,
  userUid,
}: MakeUpdateUserGridLocationProps) => (
  row: number | null,
  column: number | null
) => {
  if (row === null || column === null) {
    return setGridData({
      venueId,
      userId: userUid,
      gridData: undefined,
    });
  }

  return setGridData({
    venueId,
    userId: userUid,
    gridData: { row, column },
  });
};

export interface SetGridDataProps {
  venueId: string;
  userId: string;

  gridData?: AnyGridData;
}

export const setGridData = async ({
  venueId,
  userId,
  gridData,
}: SetGridDataProps): Promise<void> => {
  const userProfileRef = firebase.firestore().collection("users").doc(userId);

  const newGridData = {
    [`data.${venueId}`]: gridData ?? firebase.firestore.FieldValue.delete(),
  };

  return userProfileRef.update(newGridData).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/profile::setGridData",
        venueId,
        userId,
        gridData,
      });
    });
  });
};

export interface UpdateUserOnlineStatusProps {
  status?: UserStatus;
  userId: string;
}

export const updateUserOnlineStatus = async ({
  status,
  userId,
}: UpdateUserOnlineStatusProps): Promise<void> => {
  const userProfileRef = getUserRef(userId);

  const newUserStatusData = {
    status: status ?? firebase.firestore.FieldValue.delete(),
  };

  const context = {
    location: "api/profile::updateUserOnlineStatus",
    status,
    userId,
  };

  return userProfileRef.update(newUserStatusData).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", context);
    });
  });
};

// ================================================= Personalized Schedule
export const addEventToPersonalizedSchedule = ({
  event,
  userId,
}: Omit<UpdatePersonalizedScheduleProps, "removeMode">): Promise<void> =>
  updatePersonalizedSchedule({ event, userId });

export const removeEventFromPersonalizedSchedule = ({
  event,
  userId,
}: Omit<UpdatePersonalizedScheduleProps, "removeMode">): Promise<void> =>
  updatePersonalizedSchedule({ event, userId, removeMode: true });

export interface UpdatePersonalizedScheduleProps {
  event: WithVenueId<VenueEvent>;
  userId: string;
  removeMode?: boolean;
}

export const updatePersonalizedSchedule = async ({
  event,
  userId,
  removeMode = false,
}: UpdatePersonalizedScheduleProps): Promise<void> =>
  updateUserCollection({
    userId,
    removeMode,
    collectionKey: `myPersonalizedSchedule.${event.venueId}`,
    collectionValue: [event.id],
  });

// ================================================= Profile Links
export interface UpdateProfileLinksProps {
  profileLinks: ProfileLink[];
  userId: string;
}

export const updateProfileLinks = async ({
  profileLinks,
  userId,
}: UpdateProfileLinksProps): Promise<void> => {
  const userProfileRef = getUserRef(userId);

  return userProfileRef.update({ profileLinks }).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/profile::updateProfileLinks",
        profileLinks,
        userId,
        event,
      });

      throw err;
    });
  });
};

// ================================================= User Collection
export interface UpdateUserCollectionProps {
  collectionKey: string;
  collectionValue: unknown[];
  userId: string;
  removeMode?: boolean;
}

export const updateUserCollection = async ({
  collectionKey,
  collectionValue,
  userId,
  removeMode = false,
}: UpdateUserCollectionProps): Promise<void> => {
  const userProfileRef = getUserRef(userId);

  const modify = removeMode
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const modifiedCollection = {
    [collectionKey]: modify(...collectionValue),
  };

  return userProfileRef.update(modifiedCollection).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/profile::updateUserCollectionProps",
        collectionKey,
        collectionValue,
        userId,
        removeMode,
        event,
      });

      throw err;
    });
  });
};
