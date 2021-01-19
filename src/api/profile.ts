import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { UserExperienceData } from "types/User";

export interface MakeUpdateUserGridLocationProps {
  venueId?: string;
  userUid?: string;
  profileData?: UserExperienceData;
}

// @debt this is a potential race condition. we should read the profileData + update
// it in a transaction here (or a function) rather than using potentially stale data
export const makeUpdateUserGridLocation = ({
  venueId,
  userUid,
  profileData,
}: MakeUpdateUserGridLocationProps) => (
  row: number | null,
  column: number | null
) => {
  if (!userUid || !venueId || !profileData) return;

  const doc = `users/${userUid}`;

  const newData = {
    data: {
      ...profileData,
      [venueId]: {
        row,
        column,
      },
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
