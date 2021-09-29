import React, { useCallback, useState } from "react";
import classNames from "classnames";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_ENABLE_JUKEBOX,
  DEFAULT_SHOW_REACTIONS,
  IFRAME_ALLOW,
} from "settings";

import { JazzbarVenue, VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";
import { openUrl, venueInsideUrl } from "utils/url";

import { useExperiences } from "hooks/useExperiences";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateRecentSeatedTableUsers } from "hooks/useUpdateRecentSeatedUsers";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Jukebox } from "components/molecules/Jukebox/Jukebox";
import { ReactionsBar } from "components/molecules/ReactionsBar";
import TableHeader from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { TablesUserList } from "components/molecules/TablesUserList";
import { UserList } from "components/molecules/UserList";

import { BackButton } from "components/atoms/BackButton";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import { JazzBarRoom } from "../components/JazzBarRoom";
import { JazzBarTableComponent } from "../components/JazzBarTableComponent";

import { JAZZBAR_TABLES } from "./constants";

import "components/templates/Jazzbar/JazzBar/JazzBar.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ venue }) => {
  const {
    isShown: showOnlyAvailableTables,
    toggle: toggleTablesVisibility,
  } = useShowHide();
  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });
  const parentVenueId = parentVenue?.id;
  const [iframeUrl, changeIframeUrl] = useState(venue.iframeUrl);

  // @debt This logic is a copy paste from NavBar. Move that into a separate Back button component
  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    openUrl(venueInsideUrl(parentVenueId));
  }, [parentVenueId]);

  useExperiences(venue.name);

  const jazzbarTables = venue.config?.tables ?? JAZZBAR_TABLES;

  const [seatedAtTable, setSeatedAtTable] = useState<string>();

  useUpdateRecentSeatedTableUsers(
    VenueTemplate.jazzbar,
    seatedAtTable && venue?.id
  );

  const { isShown: isUserAudioOn, toggle: toggleUserAudio } = useShowHide(true);

  const isUserAudioMuted = !isUserAudioOn;

  const shouldShowReactions =
    (seatedAtTable && venue.showReactions) ?? DEFAULT_SHOW_REACTIONS;
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
          <BackButton
            onClick={backToParentVenue}
            locationName={parentVenue.name}
          />
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
                      src={
                        convertToEmbeddableUrl({
                          url: venue.iframeUrl,
                          autoPlay: venue?.autoPlay,
                        }) ?? ""
                      }
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
                    />
                  </div>
                )}
                {shouldShowJukebox && (
                  <Jukebox
                    updateIframeUrl={changeIframeUrl}
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
              roomName={`${venue.name}-${seatedAtTable}`}
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
          />
        </div>
      </VenueWithOverlay>
    </>
  );
};
