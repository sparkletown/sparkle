import { useEffect } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/Firestore";

import { WithId } from "utils/id";
import { getAccessTokenKey } from "utils/localStorage";
import { isTruthy, notEmpty } from "utils/types";

export const useVenueAccessToken = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  useEffect(() => {
    if (!venue) return;

    const denyAccess = () => {
      localStorage.removeItem(getAccessTokenKey(venue.id));
      onDenyAccess && onDenyAccess();
    };

    if (notEmpty(venue.access)) {
      console.log("venue.access", venue.access);
      const token = localStorage.getItem(getAccessTokenKey(venue.id));
      console.log("found token:", token);
      if (!token) {
        console.log("checking access");
        firebase
          .functions()
          .httpsCallable("access-checkAccess")({
            venueId: venue.id,
            token,
          })
          .then((result) => {
            console.log(
              "access check result:",
              result,
              "isTruthy result.data:",
              isTruthy(result.data)
            );
            if (!isTruthy(result.data)) {
              firebase
                .auth()
                .signOut()
                .finally(() => {
                  denyAccess();
                });
            }
          });
      } else {
        firebase
          .auth()
          .signOut()
          .finally(() => {
            denyAccess();
          });
      }
    }
  }, [onDenyAccess, venue]);
};
