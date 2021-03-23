import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export interface MakeUpdateUserGridLocationProps {
  venueId: string;
  userUid: string;
}

// @debt Legacy way of updating grid location
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

export interface SetGridData {
  venueId: string;
  userId: string;

  // NOTE: seat options should be defined as a type for every specific case
  seatOptions: {
    row: number;
    column: number;
    sectionId: string;
  } | null;
}

export const setGridData = ({ venueId, userId, seatOptions }: SetGridData) => {
  const userProfile = firebase.firestore().collection("users").doc(userId);

  const gridData = {
    [`data.${venueId}`]: seatOptions,
  };

  userProfile.update(gridData).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.severity = "error";

      event.addMetadata("Profile::gridData", { seatOptions });
    });
  });
};
