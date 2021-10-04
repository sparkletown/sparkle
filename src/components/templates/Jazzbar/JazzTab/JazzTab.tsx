import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

// NOTE: This functionality will probably be returned in the nearest future.
// import { useForm } from "react-hook-form";
import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_ENABLE_JUKEBOX,
  IFRAME_ALLOW,
} from "settings";

import { JazzbarVenue, VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";
import { trackMixpanelEvent } from "utils/mixpanel";
import { openUrl, venueInsideUrl } from "utils/url";

import { useExperiences } from "hooks/useExperiences";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSettings } from "hooks/useSettings";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Jukebox } from "components/molecules/Jukebox/Jukebox";
import { ReactionsBar } from "components/molecules/ReactionsBar";
// NOTE: This functionality will probably be returned in the nearest future.
// import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import TableHeader from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { TablesUserList } from "components/molecules/TablesUserList";
import { UserList } from "components/molecules/UserList";

import { BackButton } from "components/atoms/BackButton";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import Room from "../components/JazzBarRoom";
import { JazzBarTableComponent } from "../components/JazzBarTableComponent";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";

interface JazzProps {
  venue: WithId<JazzbarVenue>;
}

// @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
// NOTE: This functionality will probably be returned in the nearest future.
// interface ChatOutDataType {
//   messageToTheBand: string;
// }

const Jazz: React.FC<JazzProps> = ({ venue }) => {
  const {
    isShown: showOnlyAvailableTables,
    toggle: toggleTablesVisibility,
  } = useShowHide();
  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });
  const { isLoaded: areSettingsLoaded, settings } = useSettings();
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

  useUpdateTableRecentSeatedUsers(
    VenueTemplate.jazzbar,
    seatedAtTable && venue?.id
  );

  const { isShown: isUserAudioOn, toggle: toggleUserAudio } = useShowHide(true);

  const { user } = useUser();

  const isUserAudioMuted = !isUserAudioOn;

  // NOTE: This functionality will probably be returned in the nearest future.

  // @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
  // const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  // @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
  // useEffect(() => {
  //   if (isMessageToTheBandSent) {
  //     setTimeout(() => {
  //       setIsMessageToTheBandSent(false);
  //     }, 2000);
  //   }
  // }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  // @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
  // const {
  //   register: registerBandMessage,
  //   handleSubmit: handleBandMessageSubmit,
  //   reset,
  // } = useForm<ChatOutDataType>({
  //   mode: "onSubmit",
  // });

  // @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
  // const onBandMessageSubmit = async (data: ChatOutDataType) => {
  //   setIsMessageToTheBandSent(true);
  //   user &&
  //     dispatch(
  //       addReaction({
  //         venueId,
  //         reaction: createReaction(
  //           { reaction: TextReactionType, text: data.messageToTheBand },
  //           user
  //         ),
  //       })
  //     );
  //   reset();
  // };

  useEffect(() => {
    trackMixpanelEvent("enter jazz bar", {
      worldId: venue.worldId,
      email: user?.email,
    });
  }, [user?.email, venue.worldId]);

  useEffect(() => {
    seatedAtTable &&
      trackMixpanelEvent("select table", {
        worldId: venue.worldId,
        email: user?.email,
      });

    seatedAtTable &&
      trackMixpanelEvent("sit down in seat", {
        worldId: venue.worldId,
        email: user?.email,
      });
  }, [seatedAtTable, user?.email, venue.worldId]);

  const shouldShowReactions =
    seatedAtTable && areSettingsLoaded && settings.showReactions;
  const firstTableReference = jazzbarTables[0].reference;

  const shouldShowJukebox =
    (!!seatedAtTable &&
      venue.enableJukebox &&
      seatedAtTable === firstTableReference) ??
    DEFAULT_ENABLE_JUKEBOX;
  // @debt will be needed if shoutouts are restored
  // const shouldShowShoutouts = venueToUse?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS;

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

                    {/* @debt if/when this functionality is restored, it should be conditionally rendered using venue.showShoutouts */}
                    {/* NOTE: This functionality will probably be returned in the nearest future. */}
                    {/* {shouldShowShoutouts && (
                    <CallOutMessageForm
                    onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
                    ref={registerBandMessage({ required: true })}
                    isMessageToTheBandSent={isMessageToTheBandSent}
                    placeholder="Shout out..."
                    />
                  )} */}
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
            <Room
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

export default Jazz;
