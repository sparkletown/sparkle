import { useCallback, useEffect, useState } from "react";

import { AnyVenue } from "types/Firestore";

import { WithId } from "utils/id";
import {
  checkAccess,
  getLocalStorageToken,
  removeLocalStorageToken,
} from "utils/localStorage";
import { isTruthy } from "utils/types";

import { useUser } from "./useUser";

export const useVenueAccess = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  const [isCheckingAccess, setCheckingAccess] = useState<boolean>(false);
  const { user } = useUser();

  const denyAccess = useCallback(() => {
    if (!venue) return;
    onDenyAccess && onDenyAccess();

    removeLocalStorageToken(venue.id);
  }, [onDenyAccess, venue]);

  const checkVenueAccess = useCallback(async () => {
    if (!venue || isCheckingAccess) return;

    if (venue.access && user) {
      setCheckingAccess(true);
      const token = getLocalStorageToken(venue.id) ?? undefined;

      await checkAccess({
        venueId: venue.id,
        token,
      })
        .then((result) => {
          if (!isTruthy(result?.data?.token)) {
            denyAccess();
          }
        })
        .catch(() => {
          denyAccess();
        });
    }
  }, [denyAccess, isCheckingAccess, user, venue]);

  useEffect(() => {
    checkVenueAccess();
  }, [checkVenueAccess]);

  return isCheckingAccess;
};
