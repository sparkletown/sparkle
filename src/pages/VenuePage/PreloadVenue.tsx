import firebase from "firebase/app";
import React from "react";
import { Helmet } from "react-helmet";
import { useAsync } from "react-use";

import { AnyVenue } from "types/venues";

import { withId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";

import { useVenueId } from "hooks/useVenueId";

export const PreloadVenue: React.FC = ({ children }) => {
  const venueId = useVenueId();
  const { loading, error, value: venue } = useAsync(async () => {
    if (!venueId) return;

    return tracePromise(
      "VenuePage::getVenue",
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

  console.log(
    "PreloadVenue()",
    "loading:",
    loading,
    "error:",
    error,
    "venue:",
    venue
  );

  const links = [
    venue?.mapBackgroundImageUrl,
    venue?.host?.icon,
    venue?.config?.landingPageConfig?.bannerImageUrl,
    venue?.config?.landingPageConfig?.coverImageUrl,
  ]
    .concat((venue?.rooms ?? []).map((room) => room?.image_url))
    .filter((url) => url);

  return (
    <>
      <Helmet>
        {links.map((href) => (
          <link
            key={href}
            href={href}
            rel="preload"
            as="image"
            crossOrigin="anonymous"
          />
        ))}
      </Helmet>
      {children}
    </>
  );
};
