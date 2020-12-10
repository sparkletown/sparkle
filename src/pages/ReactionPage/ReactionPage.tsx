import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useFirestoreConnect } from "react-redux-firebase";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import ReactionList from "components/templates/Jazzbar/components/ReactionList";
import { useSelector } from "hooks/useSelector";
import { MessageToTheBandReaction } from "utils/reactions";
import { WithId } from "utils/id";
import { currentVenueSelectorData, partygoersSelector } from "utils/selectors";

const ReactionPage = () => {
  useConnectPartyGoers();

  const venue = useSelector(currentVenueSelectorData);
  const partygoers = useSelector(partygoersSelector);
  const usersById = partygoers;
  const reactions = useSelector((state) => state.firestore.ordered.reactions);
  const chats = useSelector((state) =>
    state.firestore.ordered.venueChats?.filter((chat) => chat.deleted !== true)
  );

  useFirestoreConnect([
    venue
      ? {
          collection: "experiences",
          doc: venue.name,
          subcollections: [{ collection: "reactions" }],
          storeAs: "reactions",
          orderBy: ["created_at", "desc"],
        }
      : {},
  ]);

  const messagesToTheBand = reactions?.filter(
    (reaction) => reaction.reaction === "messageToTheBand"
  ) as Array<WithId<MessageToTheBandReaction>>;

  return (
    <WithNavigationBar>
      <div className="full-page-container reaction-page-container">
        <h1 className="title">Audience Reactions</h1>
        <div className="row">
          <div className="col-8">
            {usersById && (
              <ReactionList reactions={messagesToTheBand} chats={chats} />
            )}
          </div>
          {partygoers && (
            <div className="col-4">
              <UserList
                users={partygoers}
                isAudioEffectDisabled
                imageSize={50}
              />
            </div>
          )}
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default ReactionPage;
