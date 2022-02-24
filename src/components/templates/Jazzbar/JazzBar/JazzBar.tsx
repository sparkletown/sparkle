import React, { useEffect } from "react";

import { JAZZBAR_TABLES } from "settings";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useUserId } from "hooks/user/useUserId";

import { MediaPlayer } from "components/attendee/MediaPlayer";
import { TableGrid } from "components/attendee/TableGrid";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";
import { Loading } from "components/molecules/Loading";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import styles from "./JazzBar.module.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ venue }) => {
  const analytics = useAnalytics({ venue });

  useBackgroundGradient();

  const jazzbarTables = venue.config?.tables ?? JAZZBAR_TABLES;

  const { userId } = useUserId();

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  if (!userId) {
    return <Loading />;
  }

  return (
    <>
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
