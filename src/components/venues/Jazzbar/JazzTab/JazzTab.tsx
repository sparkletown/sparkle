import React, { useContext, useState, useEffect } from "react";
import { User as FUser } from "firebase";
import { useForm } from "react-hook-form";

import "./JazzTab.scss";
import "./TableHeader.scss";
import TablesUserList from "components/molecules/TablesUserList";
import { useSelector } from "react-redux";
import TableComponent from "components/molecules/TableComponent";
import UserList from "components/molecules/UserList";
import Room from "components/organisms/Room";
import { User } from "types/User";
import { JAZZBAR_TABLES } from "./constants";
import {
  ExperienceContext,
  Reactions,
  EmojiReactionType,
  TextReactionType,
  Reaction,
} from "components/context/ExperienceContext";
import CallOutMessageForm from "./CallOutMessageForm";
import TableHeader from "components/molecules/TableHeader";
import { Venue, VenueTemplate } from "pages/VenuePage/VenuePage";
import { useFirestoreConnect } from "react-redux-firebase";
import MessageList from "../components/MessageList";
import {
  ChatContext,
  RestrictedChatMessage,
} from "components/context/ChatContext";

interface PropsType {
  setUserList: (value: User[]) => void;
}

interface ChatOutDataType {
  messageToTheBand: string;
}

export interface JazzbarVenue extends Venue {
  template: VenueTemplate.jazzbar;
  iframeUrl: string;
  logoImageUrl: string;
}

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  const { user, users, venue, usersById, chats } = useSelector(
    (state: any) => ({
      user: state.user,
      users: state.firestore.ordered.partygoers,
      muteReactions: state.muteReactions,
      venue: state.firestore.data.currentVenue,
      usersById: state.firestore.data.users,
      chats: state.firestore.ordered.venueChats,
    })
  ) as {
    users: User[];
    user: FUser;
    venue: JazzbarVenue;
    muteReactions: boolean;
    usersById: Omit<User, "id">[];
    chats: RestrictedChatMessage[];
  };

  useFirestoreConnect([
    {
      collection: "experiences",
      doc: venue.name,
      subcollections: [{ collection: "reactions" }],
      storeAs: "reactions",
      orderBy: ["created_at", "desc"],
    },
  ]);

  // const [isVideoFocused, setIsVideoFocused] = useState(false);
  const experienceContext = useContext(ExperienceContext);

  const [seatedAtTable, setSeatedAtTable] = useState("");

  const usersInJazzBar =
    users &&
    venue &&
    users.filter((user: User) => user.lastSeenIn === venue.name);

  function createReaction(
    reaction: { reaction: EmojiReactionType },
    user: FUser
  ): Reaction;
  function createReaction(
    reaction: { reaction: TextReactionType; text: string },
    user: FUser
  ): Reaction;
  function createReaction(reaction: any, user: FUser) {
    return {
      created_at: new Date().getTime(),
      created_by: user.uid,
      ...reaction,
    };
  }

  const reactionClicked = (user: FUser, reaction: EmojiReactionType) => {
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
    setValue: setBandMessageValue,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBandMessageSubmit = async (data: ChatOutDataType) => {
    experienceContext &&
      experienceContext.addReaction(
        createReaction(
          { reaction: "messageToTheBand", text: data.messageToTheBand },
          user
        )
      );
    setBandMessageValue([{ messageToTheBand: "" }]);
  };

  const roomName = "jazz";
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent, setIsMessageToTheBarSent]);

  const {
    register: registerBarMessage,
    handleSubmit: handleBarMessageSubmit,
    setValue: setBarMessageValue,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const chatContext = useContext(ChatContext);

  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    chatContext &&
      chatContext.sendRoomChat(user.uid, roomName, data.messageToTheBand);
    setBarMessageValue([{ messageToTheBand: "" }]);
  };

  const capacity =
    seatedAtTable &&
    JAZZBAR_TABLES.find((t) => t.reference === seatedAtTable)?.capacity;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 3,
          flexBasis: 0,
          maxHeight: "100%",
        }}
      >
        <div className="container-in-row">
          <div className="video-wrapper">
            {seatedAtTable && (
              <TableHeader
                seatedAtTable={seatedAtTable}
                setSeatedAtTable={setSeatedAtTable}
                venueName={venue.name}
              />
            )}
            <div
              style={{
                height: seatedAtTable ? undefined : "500px",
              }}
              className={`${
                seatedAtTable ? "participants-container" : "jazz-video"
              }`}
            >
              <div
                className={`${
                  seatedAtTable
                    ? `participant-container-${capacity}`
                    : "full-height-video"
                }`}
              >
                <iframe
                  key="main-event"
                  title="main event"
                  width="100%"
                  height="100%"
                  className="youtube-video"
                  src={`${venue.iframeUrl}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                />
              </div>
              {seatedAtTable && (
                <Room
                  roomName={seatedAtTable}
                  setUserList={setUserList}
                  capacity={capacity}
                />
                // <TableFooter
                //   isVideoFocused={isVideoFocused}
                //   setIsVideoFocused={setIsVideoFocused}
                // />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            border: "0px solid white",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            flex: "0 0 auto",
          }}
          className="seated-area"
        >
          <TablesUserList
            setSeatedAtTable={setSeatedAtTable}
            seatedAtTable={seatedAtTable}
            venueName={venue.name}
            TableComponent={TableComponent}
            joinMessage={true}
            customTables={JAZZBAR_TABLES}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        <div className="band-reaction-container">
          <div className="call-out-band-container-at-table">
            <CallOutMessageForm
              onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
              register={registerBandMessage}
              isMessageToTheBandSent={isMessageToTheBandSent}
              placeholder="Shout out to the band"
            />
            <div className="emoji-container">
              {Reactions.map((reaction) => (
                <button
                  className="reaction"
                  onClick={() => reactionClicked(user, reaction.type)}
                  id={`send-reaction-${reaction.type}`}
                >
                  <span role="img" aria-label={reaction.ariaLabel}>
                    {reaction.text}
                  </span>
                </button>
              ))}
            </div>
            <CallOutMessageForm
              onSubmit={handleBarMessageSubmit(onBarMessageSubmit)}
              register={registerBarMessage}
              placeholder="Chat to the bar"
              isMessageToTheBandSent={isMessageToTheBarSent}
            />
            <div>
              {usersById && chats && (
                <MessageList
                  messages={chats
                    .filter(
                      (message) =>
                        message.type === "room" && message.to === roomName
                    )
                    .sort((a, b) => b.ts_utc - a.ts_utc)}
                />
              )}
            </div>
          </div>
        </div>
        <div style={{ border: "0px solid white" }}>
          {users && (
            <UserList
              users={usersInJazzBar}
              limit={26}
              activity="listening to jazz"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Jazz;
