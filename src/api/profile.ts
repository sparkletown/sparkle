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

  firestore
    .doc(doc)
    .update(newData)
    .catch((e) => {
      // TODO: Bugsnag.notify(e) ?
      firestore.doc(doc).set(newData);
    });
};
