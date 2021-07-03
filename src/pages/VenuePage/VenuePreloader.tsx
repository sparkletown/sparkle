import firebase from "firebase/app";
import React from "react";
import { Helmet } from "react-helmet";
import { useAsync } from "react-use";

import {
  SPARKLE_ICON,
  DEFAULT_MAP_BACKGROUND,
  DEFAULT_VENUE_BANNER,
  DEFAULT_VENUE_LOGO,
} from "settings";

import { AnyVenue } from "types/venues";

import { withId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";

import { useVenueId } from "hooks/useVenueId";

export const VenuePreloader: React.FC = ({ children }) => {
  const venueId = useVenueId();
  const { loading, error, value: venue } = useAsync(async () => {
    if (!venueId) return;

    return tracePromise(
      "VenuePreloader::getVenue",
      () =>
        firebase
          .functions()
          .httpsCallable("venue-getVenue")({ venueId })
          .then((result) => {
            const data: AnyVenue | undefined = result.data;
            return isDefined(data) ? withId(data, venueId) : undefined;
          }),
      {
        attributes: {
          venueId,
        },
        withDebugLog: true,
      }
    );
  }, [venueId]);

  console[error ? "warn" : "log"](
    "VenuePreloader()",
    "loading:",
    loading,
    "error:",
    error,
    "venue:",
    venue
  );

  const links = [
    SPARKLE_ICON,
    venue?.mapBackgroundImageUrl ?? DEFAULT_MAP_BACKGROUND,
    venue?.host?.icon ?? DEFAULT_VENUE_LOGO,
    venue?.config?.landingPageConfig?.bannerImageUrl ?? DEFAULT_VENUE_BANNER,
    venue?.config?.landingPageConfig?.coverImageUrl,
  ]
    // .concat((venue?.rooms ?? []).map((room) => room?.image_url))
    .filter((url) => url);

  return (
    <>
      <Helmet>
        {links.map((href) => (
          <link key={href} href={href} rel="preload" as="image" />
        ))}
      </Helmet>
      {children}
    </>
  );
};
