import React from "react";

import { WithId } from "utils/id";
import { MessageToTheBandReaction } from "utils/reactions";
import { currentVenueSelectorData, reactionsSelector } from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useRecentVenueUsers } from "hooks/users";
import { useVenueChat } from "hooks/useVenueChat";

import ReactionList from "components/templates/Jazzbar/components/ReactionList";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import UserList from "components/molecules/UserList";

import "./ReactionPage.scss";

const ReactionPage = () => {
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers();
  const { messagesToDisplay } = useVenueChat();

  const hasPartygoers = recentVenueUsers.length > 0;

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
  const reactions = useSelector(reactionsSelector) ?? [];

  const messagesToTheBand = reactions.filter(
    (reaction): reaction is WithId<MessageToTheBandReaction> =>
      reaction.reaction === "messageToTheBand"
  );

  return (
    <WithNavigationBar>
      <div className="full-page-container reaction-page-container">
        <h1 className="title">Audience Reactions</h1>
        <div className="row">
          <div className="col-8">
            {hasPartygoers && (
              <ReactionList
                reactions={messagesToTheBand}
                chats={messagesToDisplay}
              />
            )}
          </div>
          {hasPartygoers && (
            <div className="col-4">
              <UserList
                users={recentVenueUsers}
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
