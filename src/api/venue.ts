import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export const setVenueLiveStatus = async (
  venueId: string,
  isLive: boolean
): Promise<void | firebase.functions.HttpsCallableResult> => {
  const params = {
    isLive,
    venueId,
  };

  return firebase
    .functions()
    .httpsCallable("venue-setVenueLiveStatus")(params)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::setVenueLiveStatus",
          venueId,
        });
      });
    });
};
