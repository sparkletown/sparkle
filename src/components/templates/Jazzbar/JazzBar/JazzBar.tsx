import React, { useEffect, useState } from "react";
import classNames from "classnames";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_ENABLE_JUKEBOX,
  DEFAULT_REACTIONS_AUDIBLE,
  DEFAULT_SHOW_REACTIONS,
  IFRAME_ALLOW,
} from "settings";

import { JazzbarVenue, VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useExperiences } from "hooks/useExperiences";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSettings } from "hooks/useSettings";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Jukebox } from "components/molecules/Jukebox/Jukebox";
import { ReactionsBar } from "components/molecules/ReactionsBar";
import { TableHeader } from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { TablesUserList } from "components/molecules/TablesUserList";
import { UserList } from "components/molecules/UserList";

import { BackButton } from "components/atoms/BackButton";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import { JazzBarRoom } from "../components/JazzBarRoom";
import { JazzBarTableComponent } from "../components/JazzBarTableComponent";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzBar.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ venue }) => {
  const {
    isShown: showOnlyAvailableTables,
    toggle: toggleTablesVisibility,
  } = useShowHide();
  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });
  const { isLoaded: areSettingsLoaded, settings } = useSettings();
  const embedIframeUrl = convertToEmbeddableUrl({
    url: venue.iframeUrl,
    autoPlay: venue.autoPlay,
  });
  const [iframeUrl, setIframeUrl] = useState(embedIframeUrl);
  const analytics = useAnalytics({ venue });

  useExperiences(venue.name);

  const jazzbarTables = venue.config?.tables ?? JAZZBAR_TABLES;

  const [seatedAtTable, setSeatedAtTable] = useState<string>();

  useUpdateTableRecentSeatedUsers(
    VenueTemplate.jazzbar,
    seatedAtTable && venue?.id
  );

  const isReactionsAudioDisabled = !venue.isReactionsMuted;

  const {
    isShown: isUserAudioOn,
    toggle: toggleUserAudio,
    hide: disableUserAudio,
    show: enableUserAudio,
  } = useShowHide(venue.isReactionsMuted ?? DEFAULT_REACTIONS_AUDIBLE);

  useEffect(() => {
    if (venue.isReactionsMuted) {
      enableUserAudio();
    } else {
      disableUserAudio();
    }
  }, [venue.isReactionsMuted, disableUserAudio, enableUserAudio]);

  const isUserAudioMuted = !isUserAudioOn;

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  useEffect(() => {
    seatedAtTable && analytics.trackSelectTableEvent();
  }, [analytics, seatedAtTable]);

  const shouldShowReactions =
    seatedAtTable &&
    areSettingsLoaded &&
    (settings.showReactions ?? DEFAULT_SHOW_REACTIONS) &&
    (venue.showReactions ?? DEFAULT_SHOW_REACTIONS);

  const firstTableReference = jazzbarTables[0].reference;

  const shouldShowJukebox =
    (!!seatedAtTable &&
      venue.enableJukebox &&
      seatedAtTable === firstTableReference) ??
    DEFAULT_ENABLE_JUKEBOX;

  const containerClasses = classNames("music-bar", {
    "music-bar--tableview": seatedAtTable,
  });

  const videoContainerClasses = classNames("video-container", {
    "video-container--seated": seatedAtTable,
  });

  if (!venue) return <>Loading...</>;

  return (
    <>
      <VenueWithOverlay
        venue={venue}
        containerClassNames={`music-bar ${containerClasses}`}
      >
        {!seatedAtTable && parentVenue && (
          <BackButton variant="simple" space={parentVenue} />
        )}

        {!seatedAtTable && (
          <UserList
            usersSample={venue.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={venue.recentUserCount ?? 0}
            activity={venue.activity ?? "here"}
          />
        )}

        {seatedAtTable && (
          <TableHeader
            seatedAtTable={seatedAtTable}
            setSeatedAtTable={setSeatedAtTable}
            venueName={venue.name}
            tables={jazzbarTables}
            venueId={venue.id}
          />
        )}
        {venue.description?.text && (
          <div className="row">
            <div className="col">
              <div className="description">
                <RenderMarkdown text={venue.description?.text} />
              </div>
            </div>
          </div>
        )}

        <div className="music-bar-content">
          <div className={videoContainerClasses}>
            {!venue.hideVideo && (
              <>
                <div className="iframe-container">
                  {iframeUrl ? (
                    <iframe
                      key="main-event"
                      title="main event"
                      className="iframe-video"
                      src={iframeUrl}
                      frameBorder="0"
                      allow={IFRAME_ALLOW}
                    />
                  ) : (
                    <div className="iframe-video">
                      Embedded Video URL not yet set up
                    </div>
                  )}
                </div>

                {shouldShowReactions && (
                  <div className="actions-container">
                    <ReactionsBar
                      venueId={venue.id}
                      isReactionsMuted={isUserAudioMuted}
                      toggleMute={toggleUserAudio}
                      isAudioDisabled={isReactionsAudioDisabled}
                    />
                  </div>
                )}
                {shouldShowJukebox && (
                  <Jukebox
                    updateIframeUrl={setIframeUrl}
                    venue={venue}
                    tableRef={seatedAtTable}
                  />
                )}

                {!seatedAtTable && (
                  <TablesControlBar
                    containerClassName="ControlBar__container"
                    onToggleAvailableTables={toggleTablesVisibility}
                    showOnlyAvailableTables={showOnlyAvailableTables}
                  />
                )}
              </>
            )}
          </div>
          {seatedAtTable && (
            <JazzBarRoom
              roomName={`${venue.id}-${seatedAtTable}`}
              venueId={venue.id}
              setSeatedAtTable={setSeatedAtTable}
              isAudioEffectDisabled={isUserAudioMuted}
            />
          )}
          <TablesUserList
            setSeatedAtTable={setSeatedAtTable}
            seatedAtTable={seatedAtTable}
            venueId={venue.id}
            TableComponent={JazzBarTableComponent}
            joinMessage={!venue.hideVideo ?? true}
            customTables={jazzbarTables}
            showOnlyAvailableTables={showOnlyAvailableTables}
            venue={venue}
          />
        </div>
      </VenueWithOverlay>
    </>
  );
};
