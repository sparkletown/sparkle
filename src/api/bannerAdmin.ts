import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable } from "firebase/functions";

import { Banner } from "types/banner";

interface UpdateBannerProps {
  spaceId: string;
  banner?: Banner;
  onError?: (errorMsg: string) => void;
}

export const updateBanner = async ({
  spaceId,
  banner,
  onError = () => {},
}: UpdateBannerProps): Promise<void> => {
  const params = {
    venueId: spaceId,
    banner: banner ?? firebase.firestore.FieldValue.delete(),
  };

  await httpsCallable(
    FIREBASE.functions,
    "venue-adminUpdateBannerMessage"
  )(params).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("context", {
        location: "api/bannerAdmin::updateBanner",
        spaceId,
        banner,
      });
    });
    onError?.(e.toString());
  });
};
