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
import TableFooter from "components/molecules/TableFooter";
import { Venue, VenueTemplate } from "pages/VenuePage/VenuePage";
import { useFirestoreConnect } from "react-redux-firebase";
import ReactionList from "../components/ReactionList";

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
  const { user, users, venue, usersById, reactions } = useSelector(
    (state: any) => ({
      user: state.user,
      users: state.firestore.ordered.partygoers,
      muteReactions: state.muteReactions,
      venue: state.firestore.data.currentVenue,
      usersById: state.firestore.data.users,
      reactions: state.firestore.ordered.reactions,
    })
  ) as {
    users: User[];
    user: FUser;
    venue: JazzbarVenue;
    muteReactions: boolean;
    usersById: Omit<User, "id">[];
    reactions: Reaction[] | undefined;
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

  const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBandSent) {
      setTimeout(() => {
        setIsMessageToTheBandSent(false);
      }, 2000);
    }
  }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  const [isVideoFocused, setIsVideoFocused] = useState(false);
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

  const { register, handleSubmit, setValue } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: ChatOutDataType) => {
    experienceContext &&
      experienceContext.addReaction(
        createReaction(
          { reaction: "messageToTheBand", text: data.messageToTheBand },
          user
        )
      );
    setValue([{ messageToTheBand: "" }]);
    setIsMessageToTheBandSent(true);
  };

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
        <div
          style={{
            border: "0px solid white",
            height: seatedAtTable ? undefined : "500px",
            flex: seatedAtTable ? "1 1 auto" : undefined,
          }}
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
          {seatedAtTable && (
            <div className="container-in-row">
              <div
                className={`${
                  isVideoFocused ? "col-5" : "col-12"
                } table-container`}
              >
                <TableHeader
                  seatedAtTable={seatedAtTable}
                  setSeatedAtTable={setSeatedAtTable}
                  venueName={venue.name}
                />
                <div className="participants-container">
                  <Room
                    roomName={seatedAtTable}
                    setUserList={setUserList}
                    capacity={
                      JAZZBAR_TABLES.find((t) => t.reference === seatedAtTable)
                        ?.capacity
                    }
                  />
                </div>
                <TableFooter
                  isVideoFocused={isVideoFocused}
                  setIsVideoFocused={setIsVideoFocused}
                />
              </div>
            </div>
          )}
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
              onSubmit={handleSubmit(onSubmit)}
              isMessageToTheBandSent={isMessageToTheBandSent}
              register={register}
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
            <div>
              {usersById && reactions && (
                <ReactionList reactions={reactions} small />
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
