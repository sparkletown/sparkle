import React, { useState, useCallback } from "react";
import classNames from "classnames";

// NOTE: This functionality will probably be returned in the nearest future.
// import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { IFRAME_ALLOW } from "settings";
import { UserInfo } from "firebase/app";

import { User } from "types/User";
import { JazzbarVenue } from "types/venues";

import { currentVenueSelectorData, parentVenueSelector } from "utils/selectors";
import { openUrl, venueInsideUrl } from "utils/url";

import {
  EmojiReactionType,
  Reactions,
  TextReactionType,
} from "utils/reactions";

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

import { addReaction } from "store/actions/Reactions";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";

export const generateTables: (props: {
  num: number;
  capacity: number;
  rows?: number;
  columns?: number;
  titlePrefix?: string;
  appendTableNumber?: boolean;
  startFrom?: number;
}) => {} = ({
  num,
  capacity,
  rows = 2,
  columns = 3,
  titlePrefix = "Table",
  appendTableNumber = true,
  startFrom = 1,
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + idx;

    const title = appendTableNumber
      ? `${titlePrefix} ${tableNumber}`
      : titlePrefix;

    return {
      title,
      reference: title,
      capacity,
      rows,
      columns,
    };
  });

interface JazzProps {
  setUserList: (value: User[]) => void;
  venue?: JazzbarVenue;
}

// NOTE: This functionality will probably be returned in the nearest future.
// interface ChatOutDataType {
//   messageToTheBand: string;
// }

type ReactionType =
  | { reaction: EmojiReactionType }
  | { reaction: TextReactionType; text: string };

const createReaction = (reaction: ReactionType, user: UserInfo) => {
  return {
    created_at: Date.now(),
    created_by: user.uid,
    ...reaction,
  };
};

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

  const { user } = useUser();

  const jazzbarTables = venueToUse?.config?.tables ?? JAZZBAR_TABLES;

  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const dispatch = useDispatch();
  const venueId = useVenueId();

  const reactionClicked = (user: UserInfo, reaction: EmojiReactionType) => {
    dispatch(
      addReaction({
        venueId,
        reaction: createReaction({ reaction }, user),
      })
    );
    setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
  };

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
  //           { reaction: "messageToTheBand", text: data.messageToTheBand },
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
            <div className="description">{venueToUse.description?.text}</div>
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
                    {Reactions.map((reaction) => (
                      <div
                        key={reaction.name}
                        className="reaction"
                        onClick={() =>
                          user && reactionClicked(user, reaction.type)
                        }
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
