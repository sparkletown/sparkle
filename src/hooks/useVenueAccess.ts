import { useCallback, useEffect } from "react";

import { checkAccess } from "api/auth";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import {
  getLocalStorageToken,
  removeLocalStorageToken,
} from "utils/localStorage";
import { isTruthy } from "utils/types";

import { useUser } from "./useUser";

export const useVenueAccess = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  const { user } = useUser();

  const denyAccess = useCallback(() => {
    if (!venue) {
      return;
    }
    onDenyAccess && onDenyAccess();

    removeLocalStorageToken(venue.id);
  }, [onDenyAccess, venue]);

  const checkVenueAccess = useCallback(async () => {
    if (!venue) {
      return;
    }

    if (venue.access && user) {
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
  }, [denyAccess, user, venue]);

  useEffect(() => {
    checkVenueAccess();
  }, [checkVenueAccess]);
};
