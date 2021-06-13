import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { BannerFormData } from "types/banner";

export const makeUpdateBanner = async ({
  venueId,
  banner,
  onError = () => {}
}: {
  venueId: string;
  banner: BannerFormData;
  onError?: (errorMsg: string) => void
}): Promise<void> => {
  const params = {
    venueId,
    banner,
  };

  await firebase
    .functions()
    .httpsCallable("venue-adminUpdateBannerMessage")(params)
    .catch((e) => {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("context", {
          location: "api/bannerAdmin::makeUpdateBanner",
          venueId,
          banner,
        });
      });
      onError?.(e.toString());
    });
};
