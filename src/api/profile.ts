import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

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

export interface SaveEventToProfileProps {
  venueId: string;
  userId: string;
  eventId: string;
  removeMode?: boolean;
}

export const saveEventToProfile = async ({
  venueId,
  userId,
  eventId,
  removeMode = false,
}: SaveEventToProfileProps): Promise<void> => {
  const userProfileRef = firebase.firestore().collection("users").doc(userId);

  const modify = removeMode
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const newSavedEvents = {
    [`myPersonalizedSchedule.${venueId}`]: modify(eventId),
  };

  return userProfileRef.update(newSavedEvents).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/profile::saveEventToProfile",
        venueId,
        userId,
        eventId,
        removeMode,
      });
    });
  });
};
