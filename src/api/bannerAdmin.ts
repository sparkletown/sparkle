import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export const makeUpdateBanner = (
  venueId: string,
  onError?: (errorMsg: string) => void
) => async (message?: string): Promise<void> => {
  const params = {
    venueId,
    bannerMessage: message ?? "",
  };

  await firebase
    .functions()
    .httpsCallable("venue-adminUpdateBannerMessage")(params)
    .catch((e) => {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("context", {
          location: "api/bannerAdmin::makeUpdateBanner",
          venueId,
          message,
        });
      });
      onError?.(e.toString());
    });
};
