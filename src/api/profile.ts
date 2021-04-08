import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { AnyGridData } from "types/grid";

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

  return userProfile.update(newGridData).catch((err) => {
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
