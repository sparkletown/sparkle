import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { Banner } from "types/banner";

export interface MakeUpdateBannerProps {
  venueId: string;
  banner?: Banner;
  onError?: (errorMsg: string) => void;
}

export const makeUpdateBanner = async ({
  venueId,
  banner,
  onError = () => {},
}: MakeUpdateBannerProps): Promise<void> => {
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
          location: "api/bannerAdmin::makeUpdateBanner",
          venueId,
          banner,
        });
      });
      onError?.(e.toString());
    });
};
