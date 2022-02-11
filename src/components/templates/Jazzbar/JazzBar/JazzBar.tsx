import React, { useCallback, useEffect, useState } from "react";
import {
  faCompressArrowsAlt,
  faExpandArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";

import {
  DEFAULT_REACTIONS_MUTED,
  IFRAME_ALLOW,
  JAZZBAR_TABLES,
} from "settings";

import { unsetTableSeat } from "api/venue";

import { JazzbarVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
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
  const embedIframeUrl = convertToEmbeddableUrl({
    url: venue.iframeUrl,
    autoPlay: venue.autoPlay,
  });
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

  const [expandedIframe, setExpandedIframe] = useState(false);

  const toggleExpandedIframe = useCallback(() => {
    setExpandedIframe((prevValue) => !prevValue);
  }, [setExpandedIframe]);

  if (!venue) return <>Loading...</>;

  const videoClassnames = classNames(styles.video, {
    [styles.video__expanded]: expandedIframe,
  });

  return (
    <>
      {parentVenue && <BackButton variant="simple" space={parentVenue} />}

      {!venue.hideVideo && (
        <div className={styles.componentMediaObject}>
          <div className={videoClassnames}>
            {embedIframeUrl ? (
              <iframe
                key="main-event"
                title="main event"
                className={styles.iframe}
                src={embedIframeUrl}
                frameBorder="0"
                allow={IFRAME_ALLOW}
              />
            ) : (
              <div className="iframe-video">
                {/* TODO */}
                Embedded Video URL not yet set up
              </div>
            )}
          </div>
          <div className={styles.mediaControls}>
            <FontAwesomeIcon
              icon={expandedIframe ? faCompressArrowsAlt : faExpandArrowsAlt}
              onClick={toggleExpandedIframe}
            />
          </div>
        </div>
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
