import { useCallback, useEffect } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/Firestore";

import { WithId } from "utils/id";
import {
  checkAccess,
  getLocalStorageToken,
  removeLocalStorageToken,
} from "utils/localStorage";
import { isTruthy } from "utils/types";

export const useVenueAccess = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  const denyAccess = useCallback(() => {
    if (!venue) return;

    removeLocalStorageToken(venue.id);
    onDenyAccess && onDenyAccess();
  }, [onDenyAccess, venue]);

  const logout = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .finally(() => {
        denyAccess();
      });
  }, [denyAccess]);

  useEffect(() => {
    if (!venue) return;

    if (venue.access) {
      const token = getLocalStorageToken(venue.id);
      if (token) {
        checkAccess({
          venueId: venue.id,
          token,
        }).then((result) => {
          if (!isTruthy(result.data)) {
            logout();
          }
        });
      } else {
        firebase
          .auth()
          .signOut()
          .finally(() => {
            logout();
          });
      }
    }
  }, [logout, venue]);
};
