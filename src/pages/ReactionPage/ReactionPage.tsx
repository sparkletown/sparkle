import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import ReactionList from "components/templates/Jazzbar/components/ReactionList";
import { useSelector } from "hooks/useSelector";
import { useRecentWorldUsers } from "hooks/users";
import { MessageToTheBandReaction } from "utils/reactions";
import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";

const ReactionPage = () => {
  const venue = useSelector(currentVenueSelectorData);
  const { recentWorldUsers } = useRecentWorldUsers();
  const reactions = useSelector((state) => state.firestore.ordered.reactions);
  const chats =
    useSelector((state) =>
      state.firestore.ordered.venueChats?.filter(
        (chat) => chat.deleted !== true
      )
    ) ?? [];

  const hasPartygoers = recentWorldUsers.length > 0;

  useFirestoreConnect(
    venue
      ? {
          collection: "experiences",
          doc: venue.name,
          subcollections: [{ collection: "reactions" }],
          orderBy: ["created_at", "desc"],
          storeAs: "reactions",
        }
      : undefined
  );

  const messagesToTheBand = reactions?.filter(
    (reaction) => reaction.reaction === "messageToTheBand"
  ) as Array<WithId<MessageToTheBandReaction>>;

  return (
    <WithNavigationBar>
      <div className="full-page-container reaction-page-container">
        <h1 className="title">Audience Reactions</h1>
        <div className="row">
          <div className="col-8">
            {hasPartygoers && (
              <ReactionList reactions={messagesToTheBand} chats={chats} />
            )}
          </div>
          {hasPartygoers && (
            <div className="col-4">
              <UserList
                users={recentWorldUsers}
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
