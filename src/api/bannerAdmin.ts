import Bugsnag from "@bugsnag/js";
import firebase from "firebase/compat/app";

import { Banner } from "types/banner";

export interface UpdateBannerProps {
  venueId: string;
  banner?: Banner;
  onError?: (errorMsg: string) => void;
}

export const updateBanner = async ({
  venueId,
  banner,
  onError = () => {},
}: UpdateBannerProps): Promise<void> => {
  const params = {
    venueId,
    banner: banner ?? firebase.firestore.FieldValue.delete(),
  };

  await firebase
    .functions()
    .httpsCallable("venue-adminUpdateBannerMessage")(params)
    .catch((e) => {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("context", {
          location: "api/bannerAdmin::updateBanner",
          venueId,
          banner,
        });
      });
      onError?.(e.toString());
    });
};
