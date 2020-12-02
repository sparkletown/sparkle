import firebase from "firebase";

export const makeUpdateBanner = (
  venueId: string,
  onError: (errorMsg: string) => void
) => (message?: string) => {
  const params = {
    venueId,
    bannerMessage: message ? message : "",
  };

  firebase
    .functions()
    .httpsCallable("venue-adminUpdateBannerMessage")(params)
    .catch((e) => onError(e.toString()));
};
