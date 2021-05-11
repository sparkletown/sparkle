import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { VenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";

export interface MakeUpdateUserGridLocationProps {
  venueId: string;
  userUid: string;
}

export const makeUpdateUserGridLocation = ({
  venueId,
  userUid,
}: MakeUpdateUserGridLocationProps) => (
  row: number | null,
  column: number | null
) => {
  const doc = `users/${userUid}`;

  const newData = {
    [`data.${venueId}`]: {
      row,
      column,
    },
  };

  const firestore = firebase.firestore();

  // @debt refactor this to use a proper upsert pattern instead of error based try/catch logic
  firestore
    .doc(doc)
    .update(newData)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.severity = "info";

        event.addMetadata(
          "notes",
          "TODO",
          "refactor this to use a proper upsert pattern (eg. check that the doc exists, then insert or update accordingly), rather than using try/catch"
        );

        event.addMetadata("api::profile::makeUpdateUserGridLocation", {
          venueId,
          userUid,
          doc,
        });
      });

      firestore.doc(doc).set(newData);
    });
};

export interface UpdatePersonalizedScheduleProps {
  event: WithVenueId<VenueEvent>;
  userId: string;
  removeMode?: boolean;
}

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

export const updatePersonalizedSchedule = async ({
  event,
  userId,
  removeMode = false,
}: UpdatePersonalizedScheduleProps): Promise<void> => {
  const userProfileRef = firebase.firestore().collection("users").doc(userId);

  const modify = removeMode
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const newSavedEvents = {
    [`myPersonalizedSchedule.${event.venueId}`]: modify(event.id),
  };

  return userProfileRef.update(newSavedEvents).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/profile::saveEventToProfile",
        userId,
        event,
        removeMode,
      });

      throw err;
    });
  });
};

export interface SavePosterToProfileProps {
  venueId: string;
  userId: string;
  removeMode?: boolean;
}

export function savePosterToProfile({
  venueId,
  userId,
  removeMode = false,
}: SavePosterToProfileProps): Promise<void> {
  const userProfileRef = firebase.firestore().collection("users").doc(userId);

  const modify = removeMode
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const newSavedPosters = {
    [`myPersonalizedPosters.${venueId}`]: modify(venueId),
  };

  return userProfileRef.update(newSavedPosters).catch((err) => {
    Bugsnag.notify(err, (poster) => {
      poster.addMetadata("context", {
        location: "api/profile::savePosterToProfile",
        venueId,
        userId,
        removeMode,
      });
    });
  });
}
