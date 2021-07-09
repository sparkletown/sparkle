import React, { useState, useCallback, useEffect } from "react";
import classNames from "classnames";

// NOTE: This functionality will probably be returned in the nearest future.
// import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import {
  IFRAME_ALLOW,
  DEFAULT_USER_LIST_LIMIT,
  DEFAULT_SHOW_REACTIONS,
} from "settings";

import { addReaction } from "store/actions/Reactions";

import { EmojiReactionType, EmojiReactions } from "types/reactions";
import { User } from "types/User";
import { JazzbarVenue } from "types/venues";

import { createEmojiReaction } from "utils/reactions";
import { openUrl, venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";

import Room from "../components/JazzBarRoom";

// NOTE: This functionality will probably be returned in the nearest future.
// import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import JazzBarTableComponent from "../components/JazzBarTableComponent";
import TableHeader from "components/molecules/TableHeader";
import { TablesControlBar } from "components/molecules/TablesControlBar";
import { UserList } from "components/molecules/UserList";
import { BackButton } from "components/atoms/BackButton";
import { TablesUserList } from "components/molecules/TablesUserList";

import { useDispatch } from "hooks/useDispatch";
import { useExperiences } from "hooks/useExperiences";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useRecentVenueUsers } from "hooks/users";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useTables } from "hooks/useTables";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";

interface JazzProps {
  setUserList: (value: User[]) => void;
  venue: WithId<JazzbarVenue>;
}

// @debt This should probably be all rolled up into a single canonical component. Possibly CallOutMessageForm by the looks of things?
// NOTE: This functionality will probably be returned in the nearest future.
// interface ChatOutDataType {
//   messageToTheBand: string;
// }

const Jazz: React.FC<JazzProps> = ({ setUserList, venue }) => {
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue.name });

  const { isShown: isChecked, toggle: toggleTables } = useShowHide();

  const { parentVenue } = useRelatedVenues({ currentVenueId: venue.id });

  const parentVenueId = parentVenue?.id;

  // @debt This logic is a copy paste from NavBar. Move that into a separate Back button component
  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    openUrl(venueInsideUrl(parentVenueId));
  }, [parentVenueId]);

  useExperiences(venue.name);

  const { userWithId } = useUser();

  const defaultTables = venue.config?.tables ?? JAZZBAR_TABLES;
  const { availableTables } = useTables({ defaultTables });

  const [jazzbarTables, setJazzbarTables] = useState(defaultTables);

  const onToggleTables = useCallback(() => {
    toggleTables();
    setJazzbarTables(isChecked ? defaultTables : availableTables);
  }, [isChecked, defaultTables, availableTables, toggleTables]);

  useEffect(() => setJazzbarTables(defaultTables), [defaultTables]);

  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const dispatch = useDispatch();
  const venueId = useVenueId();

  // @debt de-duplicate this with version in src/components/templates/Audience/Audience.tsx
  const reactionClicked = useCallback(
    (emojiReaction: EmojiReactionType) => {
      if (!venueId || !userWithId) return;

      dispatch(
        addReaction({
          venueId,
          reaction: createEmojiReaction(emojiReaction, userWithId),
        })
      );

      // @debt Why do we have this here..? We probably shouldn't have it/need it? It's not a very Reacty thing to do..
      setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
    },
    [venueId, userWithId, dispatch]
  );

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

  const shouldShowReactions =
    (seatedAtTable && venue.showReactions) ?? DEFAULT_SHOW_REACTIONS;

  // @debt will be needed if shoutouts are restored
  // const shouldShowShoutouts = venueToUse?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS;

  const containerClasses = classNames("music-bar", {
    "music-bar--tableview": seatedAtTable,
  });

  if (!venue) return <>Loading...</>;

  return (
    <div className={containerClasses}>
      {venue.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">
              <RenderMarkdown text={venue.description?.text} />
            </div>
          </div>
        </div>
      )}

      {!seatedAtTable && parentVenue && (
        <BackButton
          onClick={backToParentVenue}
          locationName={parentVenue.name}
        />
      )}

      {!seatedAtTable && (
        <UserList
          users={recentVenueUsers}
          activity={venue.activity ?? "here"}
          limit={DEFAULT_USER_LIST_LIMIT}
          showMoreUsersToggler
        />
      )}

      {seatedAtTable && (
        <TableHeader
          seatedAtTable={seatedAtTable}
          setSeatedAtTable={setSeatedAtTable}
          venueName={venue.name}
          tables={jazzbarTables}
        />
      )}

      <div className="music-bar-content">
        <div className="video-container">
          {!venue.hideVideo && (
            <>
              <div className="iframe-container">
                {venue.iframeUrl ? (
                  <iframe
                    key="main-event"
                    title="main event"
                    className="iframe-video"
                    src={`${venue.iframeUrl}?autoplay=1`}
                    frameBorder="0"
                    allow={IFRAME_ALLOW}
                  />
                ) : (
                  <div className="iframe-video">
                    Embedded Video URL not yet set up
                  </div>
                )}
              </div>

              {/* @debt This should probably be all rolled up into a single canonical component for emoji reactions/etc*/}
              {shouldShowReactions ? (
                <div className="actions-container">
                  <div className="emoji-container">
                    {EmojiReactions.map((reaction) => (
                      <div
                        key={reaction.name}
                        className="reaction"
                        onClick={() => reactionClicked(reaction.type)}
                        id={`send-reaction-${reaction.type}`}
                      >
                        <span role="img" aria-label={reaction.ariaLabel}>
                          {reaction.text}
                        </span>
                      </div>
                    ))}
                    <div
                      className="mute-button"
                      onClick={() =>
                        setIsAudioEffectDisabled((state) => !state)
                      }
                    >
                      <FontAwesomeIcon
                        className="reaction"
                        icon={isAudioEffectDisabled ? faVolumeMute : faVolumeUp}
                      />
                    </div>
                  </div>

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
              ) : (
                <TablesControlBar
                  className="control-bar"
                  handleChecked={onToggleTables}
                  isChecked={isChecked}
                />
              )}
            </>
          )}
        </div>
        {seatedAtTable && (
          <Room
            roomName={`${venue.name}-${seatedAtTable}`}
            venueName={venue.name}
            setUserList={setUserList}
            setSeatedAtTable={setSeatedAtTable}
            isAudioEffectDisabled={isAudioEffectDisabled}
          />
        )}
        <TablesUserList
          setSeatedAtTable={setSeatedAtTable}
          seatedAtTable={seatedAtTable}
          venueName={venue.name}
          TableComponent={JazzBarTableComponent}
          joinMessage={!venue.hideVideo ?? true}
          customTables={jazzbarTables}
        />
      </div>
    </div>
  );
};

export default Jazz;
