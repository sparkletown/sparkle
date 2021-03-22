import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export interface TakeSectionSeatProps {
  venueId: string;
  userId: string;

  seatOptions: {
    row: number;
    column: number;
    sectionId: string;
  } | null;
}

export const takeSectionSeat = ({
  venueId,
  userId,
  seatOptions,
}: TakeSectionSeatProps) => {
  const userProfile = firebase.firestore().collection("users").doc(userId);

  const newData = {
    [`data.${venueId}`]: seatOptions,
  };

  userProfile.update(newData).catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.severity = "info";

      event.addMetadata(
        "notes",
        "TODO",
        "refactor this to use a proper upsert pattern (eg. check that the doc exists, then insert or update accordingly), rather than using try/catch"
      );
    });

    userProfile.set(newData);
  });
};
