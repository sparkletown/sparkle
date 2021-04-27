import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export const setVenueLiveStatus = async (venueId: string, isLive: boolean) => {
  const params = {
    isLive,
    venueId,
  };

  try {
    await firebase.functions().httpsCallable("venue-setVenueLiveStatus")(
      params
    );
  } catch (err) {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/venue::setVenueLiveStatus",
        venueId,
      });
    });
  }
};
