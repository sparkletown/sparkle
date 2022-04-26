import Bugsnag from "@bugsnag/js";
import firebase from "firebase/compat/app";

import { User } from "types/User";
import { WorldEvent } from "types/venues";

import { WithId, withId } from "utils/id";

export const getUserRef = (userId: string) =>
  firebase.firestore().collection("users").doc(userId);

export const getUser = async (userId: string): Promise<WithId<User>> => {
  const snapshot = await getUserRef(userId).get();
  return withId(snapshot.data() as User, snapshot.id);
};

export interface UpdateUserOnlineStatusProps {
  status?: string;
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

interface UpdatePersonalizedScheduleProps {
  event: WorldEvent;
  userId: string;
  removeMode?: boolean;
}

const updatePersonalizedSchedule = async ({
  event,
  userId,
  removeMode = false,
}: UpdatePersonalizedScheduleProps): Promise<void> =>
  updateUserCollection({
    userId,
    removeMode,
    collectionKey: `myPersonalizedSchedule.${event.spaceId}`,
    collectionValue: [event.id],
  });

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
