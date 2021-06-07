import React, { useState, useCallback } from "react";
import classNames from "classnames";

// NOTE: This functionality will probably be returned in the nearest future.
// import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { IFRAME_ALLOW } from "settings";

import { addReaction } from "store/actions/Reactions";

import { EmojiReactionType, EmojiReactions } from "types/reactions";
import { User } from "types/User";
import { JazzbarVenue } from "types/venues";

import { createEmojiReaction } from "utils/reactions";
import { currentVenueSelectorData, parentVenueSelector } from "utils/selectors";
import { openUrl, venueInsideUrl } from "utils/url";

import Room from "../components/JazzBarRoom";

// NOTE: This functionality will probably be returned in the nearest future.
// import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import JazzBarTableComponent from "../components/JazzBarTableComponent";
import TableHeader from "components/molecules/TableHeader";
import TablesUserList from "components/molecules/TablesUserList";

import { useDispatch } from "hooks/useDispatch";
import { useExperiences } from "hooks/useExperiences";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";

interface JazzProps {
  setUserList: (value: User[]) => void;
  venue?: JazzbarVenue;
}

// NOTE: This functionality will probably be returned in the nearest future.
// interface ChatOutDataType {
//   messageToTheBand: string;
// }

const Jazz: React.FC<JazzProps> = ({ setUserList, venue }) => {
  const firestoreVenue = useSelector(currentVenueSelectorData);
  const venueToUse = venue ? venue : firestoreVenue;

  const parentVenueId = venueToUse?.parentId;
  const parentVenue = useSelector(parentVenueSelector);

  // @debt This logic is a copy paste from NavBar. Move that into a separate Back button component
  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    openUrl(venueInsideUrl(parentVenueId));
  }, [parentVenueId]);

  useExperiences(venueToUse?.name);

  const { userWithId } = useUser();

  const jazzbarTables = venueToUse?.config?.tables ?? JAZZBAR_TABLES;

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

  // const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  // useEffect(() => {
  //   if (isMessageToTheBandSent) {
  //     setTimeout(() => {
  //       setIsMessageToTheBandSent(false);
  //     }, 2000);
  //   }
  // }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  // const {
  //   register: registerBandMessage,
  //   handleSubmit: handleBandMessageSubmit,
  //   reset,
  // } = useForm<ChatOutDataType>({
  //   mode: "onSubmit",
  // });

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

  const containerClasses = classNames("music-bar", {
    "music-bar--tableview": seatedAtTable,
  });

  if (!venueToUse) return <>Loading...</>;

  return (
    <div className={containerClasses}>
      {venueToUse.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">
              <RenderMarkdown text={venueToUse.description?.text} />
            </div>
          </div>
        </div>
      )}

      {/* @debt Move the logic of Back button into a separate reusable hook/component */}
      {!seatedAtTable && parentVenueId && parentVenue && (
        <div className="back-map-btn" onClick={backToParentVenue}>
          <div className="back-icon" />
          <span className="back-link">Back to {parentVenue.name}</span>
        </div>
      )}

      {seatedAtTable && (
        <TableHeader
          seatedAtTable={seatedAtTable}
          setSeatedAtTable={setSeatedAtTable}
          venueName={venueToUse.name}
          tables={jazzbarTables}
        />
      )}

      <div className="music-bar-content">
        <div className="video-container">
          {!venueToUse.hideVideo && (
            <>
              <div className="iframe-container">
                {venueToUse.iframeUrl ? (
                  <iframe
                    key="main-event"
                    title="main event"
                    className="iframe-video"
                    src={`${venueToUse.iframeUrl}?autoplay=1`}
                    frameBorder="0"
                    allow={IFRAME_ALLOW}
                  />
                ) : (
                  <div className="iframe-video">
                    Embedded Video URL not yet set up
                  </div>
                )}
              </div>
              {seatedAtTable && (
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
                  {/* NOTE: This functionality will probably be returned in the nearest future. */}
                  {/* <CallOutMessageForm
                  onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
                  ref={registerBandMessage({ required: true })}
                  isMessageToTheBandSent={isMessageToTheBandSent}
                  placeholder="Shout out..."
                /> */}
                </div>
              )}
            </>
          )}
        </div>
        {seatedAtTable && (
          <Room
            roomName={`${venueToUse.name}-${seatedAtTable}`}
            venueName={venueToUse.name}
            setUserList={setUserList}
            setSeatedAtTable={setSeatedAtTable}
            isAudioEffectDisabled={isAudioEffectDisabled}
          />
        )}
        <TablesUserList
          setSeatedAtTable={setSeatedAtTable}
          seatedAtTable={seatedAtTable}
          venueName={venueToUse.name}
          TableComponent={JazzBarTableComponent}
          joinMessage={!venueToUse?.hideVideo ?? true}
          customTables={jazzbarTables}
        />
      </div>
    </div>
  );
};

export default Jazz;
