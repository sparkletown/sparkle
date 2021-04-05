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
  setGridData({
    venueId,
    userId: userUid,
    gridData: { row: row as number, column: column as number },
  });
};

export interface SetGridDataProps {
  venueId: string;
  userId: string;

  gridData: AnyGridData | null;
}

export const setGridData = async ({
  venueId,
  userId,
  gridData,
}: SetGridDataProps): Promise<void> => {
  const userProfile = firebase.firestore().collection("users").doc(userId);

  const newGridData = {
    [`data.${venueId}`]: gridData,
  };

  userProfile.update(newGridData).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api::profile::setGridData",
        venueId,
        userId,
        gridData,
      });
    });
  });
};
