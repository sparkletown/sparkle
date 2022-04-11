import { useCallback, useEffect } from "react";
import { get } from "lodash/fp";

import { checkAccess } from "api/auth";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import {
  getLocalStorageToken,
  removeLocalStorageToken,
} from "utils/localStorage";
import { isTruthy } from "utils/types";

import { useLiveUser } from "./user/useLiveUser";

export const useVenueAccess = (
  venue?: WithId<AnyVenue>,
  onDenyAccess?: () => void
) => {
  const { user } = useLiveUser();

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
          if (!isTruthy(get("token", result?.data))) {
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
