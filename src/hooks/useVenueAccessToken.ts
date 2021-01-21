import { useEffect } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/Firestore";

import { WithId } from "utils/id";
import { accessTokenKey } from "utils/localStorage";
import { isTruthy, notEmpty } from "utils/types";
import { checkAccess, getLocalStorageToken } from "functions/auth";

export const useVenueAccessToken = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  useEffect(() => {
    if (!venue) return;

    const denyAccess = () => {
      localStorage.removeItem(accessTokenKey(venue.id));
      onDenyAccess && onDenyAccess();
    };

    if (notEmpty(venue.access)) {
      console.log("venue.access", venue.access);
      const token = getLocalStorageToken(venue.id) ?? undefined;
      console.log("found token:", token);
      if (!token) {
        console.log("checking access");
        checkAccess({
          venueId: venue.id,
          token,
        }).then((result) => {
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
