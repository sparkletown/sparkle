import React, { useCallback, useEffect, useState } from "react";
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
import { useExperience } from "hooks/useExperience";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { TableComponent } from "components/molecules/TableComponent";
import { TablesUserList } from "components/molecules/TablesUserList";

import { BackButton } from "components/atoms/BackButton";

import "./JazzBar.scss";

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

  // @debt what does it do anyway? cache? no useSelector here so probably connected to useUpdateTableRecentSeatedUsers
  useExperience(venue.name);

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

  if (!inHuddle && seatedAtTable) {
    leaveTable();
  }

  if (!venue) return <>Loading...</>;

  return (
    <>
      {/*
      <VenueWithOverlay
        venue={venue}
        containerClassNames={`music-bar ${containerClasses}`}
      >
      */}
      {parentVenue && <BackButton variant="simple" space={parentVenue} />}

      {!venue.hideVideo && (
        <div className="component-media-object">
          <div className="iframe-container">
            {embedIframeUrl ? (
              <iframe
                key="main-event"
                title="main event"
                className="iframe-video"
                src={embedIframeUrl}
                frameBorder="0"
                allow={IFRAME_ALLOW}
              />
            ) : (
              <div className="iframe-video">
                Embedded Video URL not yet set up
              </div>
            )}
          </div>
          <div className="media-controls"></div>
        </div>
      )}

      {/*!seatedAtTable && (
        <UserList
          usersSample={venue.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
          userCount={venue.recentUserCount ?? 0}
          activity={venue.activity ?? "here"}
        />
      )*/}

      {/*seatedAtTable && (
        <TableHeader
          seatedAtTable={seatedAtTable}
          setSeatedAtTable={setSeatedAtTable}
          venueName={venue.name}
          tables={jazzbarTables}
          venueId={venue.id}
          defaultTables={JAZZBAR_TABLES}
        />
      )*/}
      {venue.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">
              <RenderMarkdown text={venue.description?.text} />
            </div>
          </div>
        </div>
      )}

      {/*seatedAtTable && (
        <JazzBarRoom
          roomName={`${venue.id}-${seatedAtTable}`}
          venueId={venue.id}
          setSeatedAtTable={setSeatedAtTable}
          isReactionsMuted={isUserAudioMuted}
        />
      )*/}
      {userWithId && (
        <TablesUserList
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
      )}
      {/*
      </VenueWithOverlay>
        */}
    </>
  );
};
