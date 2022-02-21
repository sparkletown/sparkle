import React, { useEffect } from "react";
import { MediaPlayer } from "components/attendee/MediaPlayer";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { JAZZBAR_TABLES } from "settings";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Loading } from "components/molecules/Loading";
import { TableGrid } from "components/molecules/TableGrid";

import { BackButton } from "components/atoms/BackButton";

import styles from "./JazzBar.module.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ venue }) => {
  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });
  const analytics = useAnalytics({ venue });

  useBackgroundGradient();

  const jazzbarTables = venue.config?.tables ?? JAZZBAR_TABLES;

  const { userId } = useUser();

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  if (!userId) {
    return <Loading />;
  }

  return (
    <>
      {parentVenue && <BackButton variant="simple" space={parentVenue} />}

      {!venue.hideVideo && (
        <MediaPlayer url={venue.iframeUrl} autoPlay={venue.autoPlay || false} />
      )}

      <div className={styles.componentSpaceInfo}>
        {venue.name && <h1>{venue.name}</h1>}
      </div>

      {venue.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">
              <RenderMarkdown text={venue.description?.text} />
            </div>
          </div>
        </div>
      )}

      <TableGrid
        venueId={venue.id}
        joinMessage={!venue.hideVideo ?? true}
        customTables={jazzbarTables}
        venue={venue}
        defaultTables={JAZZBAR_TABLES}
        userId={userId}
      />
    </>
  );
};
