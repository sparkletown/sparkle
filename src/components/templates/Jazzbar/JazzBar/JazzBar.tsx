import React, { useCallback, useEffect, useState } from "react";
import { MediaPlayer } from "components/attendee/MediaPlayer";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";

import { DEFAULT_REACTIONS_MUTED, JAZZBAR_TABLES } from "settings";

import { unsetTableSeat } from "api/venue";

import { JazzbarVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { TableComponent } from "components/molecules/TableComponent";
import { TableGrid } from "components/molecules/TableGrid";

import { BackButton } from "components/atoms/BackButton";

import styles from "./JazzBar.module.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ venue }) => {
  const { isShown: showOnlyAvailableTables } = useShowHide();
  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });
  const analytics = useAnalytics({ venue });

  useBackgroundGradient();

  const jazzbarTables = venue.config?.tables ?? JAZZBAR_TABLES;

  const [seatedAtTable, setSeatedAtTable] = useState<string>();
  const { userWithId, userId } = useUser();

  useUpdateTableRecentSeatedUsers(
    VenueTemplate.jazzbar,
    seatedAtTable && venue?.id
  );

  const isReactionsMuted = venue.isReactionsMuted ?? DEFAULT_REACTIONS_MUTED;

  const { hide: enableUserAudio, show: disableUserAudio } = useShowHide(
    isReactionsMuted
  );

  useEffect(() => {
    if (isReactionsMuted) {
      disableUserAudio();
    } else {
      enableUserAudio();
    }
  }, [isReactionsMuted, disableUserAudio, enableUserAudio]);

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  useEffect(() => {
    seatedAtTable && analytics.trackSelectTableEvent();
  }, [analytics, seatedAtTable]);

  const { joinHuddle, inHuddle } = useVideoHuddle();

  const joinTable = useCallback(
    (table) => {
      // @debt TODO Fix this
      joinHuddle(userId || "", `${venue.id}-${table}`);
      setSeatedAtTable(table);
    },
    [joinHuddle, userId, venue.id]
  );

  const leaveTable = useCallback(async () => {
    if (!userId) return;

    await unsetTableSeat(userId, { venueId: venue.id });
    setSeatedAtTable(undefined);
  }, [userId, venue.id]);

  useEffect(() => {
    if (!inHuddle && seatedAtTable) {
      leaveTable();
    }
  }, [inHuddle, leaveTable, seatedAtTable]);

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
        setSeatedAtTable={joinTable}
        seatedAtTable={seatedAtTable}
        venueId={venue.id}
        TableComponent={TableComponent}
        joinMessage={!venue.hideVideo ?? true}
        customTables={jazzbarTables}
        showOnlyAvailableTables={showOnlyAvailableTables}
        venue={venue}
        defaultTables={JAZZBAR_TABLES}
        template={VenueTemplate.jazzbar}
        user={userWithId}
      />
    </>
  );
};
