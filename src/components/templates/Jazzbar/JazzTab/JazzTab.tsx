import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { IFRAME_ALLOW, LOC_UPDATE_FREQ_MS } from "settings";
import { UserInfo } from "firebase/app";

import { User } from "types/User";
import { Venue } from "types/Venue";

import { currentVenueSelectorData, partygoersSelector } from "utils/selectors";

import {
  EmojiReactionType,
  ExperienceContext,
  Reactions,
  TextReactionType,
} from "components/context/ExperienceContext";

import ChatDrawer from "components/organisms/ChatDrawer";
import Room from "components/organisms/Room";

import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import TableComponent from "components/molecules/TableComponent";
import TableHeader from "components/molecules/TableHeader";
import TablesUserList from "components/molecules/TablesUserList";
import UserList from "components/molecules/UserList";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useInterval } from "hooks/useInterval";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";

interface JazzProps {
  setUserList: (value: User[]) => void;
  venue?: Venue;
}

interface ChatOutDataType {
  messageToTheBand: string;
}

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
  useFirestoreConnect(
    venue?.name
      ? {
          collection: "experiences",
          doc: venue.name,
          storeAs: "experiences",
        }
      : undefined
  );

  const { user } = useUser();

  const firestoreVenue = useSelector(currentVenueSelectorData);

  const venueToUse = venue ? venue : firestoreVenue;

  const jazzbarTables = venueToUse?.config?.tables ?? JAZZBAR_TABLES;

  // TODO: this will break memo on venueUsers (below) every 5min, does that matter?
  const [nowMs, setNowMs] = useState(Date.now());
  useInterval(() => {
    setNowMs(Date.now());
  }, LOC_UPDATE_FREQ_MS);

  // TODO: we've memoed this now, but also maybe we can use the useCampPartygoers hook that does this sort of thing already (+rename it)?
  const venueToUseName = venueToUse?.name;
  const users = useSelector(partygoersSelector);
  const venueUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(
      (user) =>
        !!user.lastSeenIn &&
        user.lastSeenIn[venueToUseName ?? ""] >
          (nowMs - LOC_UPDATE_FREQ_MS * 2) / 1000
    );
  }, [nowMs, users, venueToUseName]);

  const experienceContext = useContext(ExperienceContext);

  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const reactionClicked = (user: UserInfo, reaction: EmojiReactionType) => {
    experienceContext &&
      experienceContext.addReaction(createReaction({ reaction }, user));
    setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
  };

  const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBandSent) {
      setTimeout(() => {
        setIsMessageToTheBandSent(false);
      }, 2000);
    }
  }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  const {
    register: registerBandMessage,
    handleSubmit: handleBandMessageSubmit,
    reset,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBandMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBandSent(true);
    experienceContext &&
      user &&
      experienceContext.addReaction(
        createReaction(
          { reaction: "messageToTheBand", text: data.messageToTheBand },
          user
        )
      );
    reset();
  };

  if (!venueToUse) return <>Loading...</>;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 3,
          flexBasis: 0,
          overflow: "hidden",
        }}
        className={`scrollable-area ${seatedAtTable && "at-table"}`}
      >
        {venueToUse.description?.text && (
          <div className="row">
            <div className="col">
              <div className="description">{venueToUse.description?.text}</div>
            </div>
          </div>
        )}
        <div className="container-in-row">
          <div className="video-wrapper">
            {seatedAtTable && (
              <TableHeader
                seatedAtTable={seatedAtTable}
                setSeatedAtTable={setSeatedAtTable}
                venueName={venueToUse.name}
                tables={jazzbarTables}
              />
            )}
            <div
              className={`${
                seatedAtTable ? "participants-container" : "jazz-video"
              }`}
            >
              {!venueToUse.hideVideo && (
                <div
                  className={`${
                    seatedAtTable
                      ? "participant-container video-participant"
                      : "full-height-video"
                  }`}
                >
                  <div
                    className="iframe-container"
                    style={{
                      height: seatedAtTable ? "calc(100% - 55px)" : "500px",
                    }}
                  >
                    {venueToUse.iframeUrl && (
                      <iframe
                        key="main-event"
                        title="main event"
                        className="youtube-video"
                        src={`${venueToUse.iframeUrl}?autoplay=1`}
                        frameBorder="0"
                        allow={IFRAME_ALLOW}
                      />
                    )}
                    {!venueToUse.iframeUrl && (
                      <div className="youtube-video">
                        Embedded Video URL not yet set up
                      </div>
                    )}
                  </div>
                  <div className="call-out-band-container">
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
                          icon={
                            isAudioEffectDisabled ? faVolumeMute : faVolumeUp
                          }
                        />
                      </div>
                    </div>
                    <CallOutMessageForm
                      onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
                      ref={registerBandMessage({ required: true })}
                      isMessageToTheBandSent={isMessageToTheBandSent}
                      placeholder="Shout out..."
                    />
                  </div>
                </div>
              )}
              {seatedAtTable && (
                <Room
                  roomName={`${venueToUse.name}-${seatedAtTable}`}
                  venueName={venueToUse.name}
                  setUserList={setUserList}
                  setSeatedAtTable={setSeatedAtTable}
                />
              )}
            </div>
          </div>
        </div>
        <UserList
          isAudioEffectDisabled={isAudioEffectDisabled}
          users={venueUsers}
          activity={venue?.activity ?? "here"}
          disableSeeAll={false}
        />
        <div className="seated-area">
          <TablesUserList
            setSeatedAtTable={setSeatedAtTable}
            seatedAtTable={seatedAtTable}
            venueName={venueToUse.name}
            TableComponent={TableComponent}
            joinMessage={!venueToUse?.hideVideo ?? true}
            customTables={jazzbarTables}
          />
        </div>
      </div>
      <div className="chat-drawer">
        <ChatDrawer
          title={`${venueToUse.name} Chat`}
          roomName={venueToUse.name}
          chatInputPlaceholder="Chat to the bar"
        />
      </div>
    </>
  );
};

export default Jazz;
