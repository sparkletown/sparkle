import React, { useMemo } from "react";

import { WithId } from "utils/id";
import { MessageToTheBandReaction } from "utils/reactions";
import { currentVenueSelectorData } from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useRecentVenueUsers } from "hooks/users";
import { useVenueId } from "hooks/useVenueId";
import { useVenueChats } from "hooks/useVenueChats";

import ReactionList from "components/templates/Jazzbar/components/ReactionList";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import UserList from "components/molecules/UserList";

import "./ReactionPage.scss";

const ReactionPage = () => {
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers();
  const reactions = useSelector((state) => state.firestore.ordered.reactions);
  const chats = useVenueChats(venueId);
  const filteredChats = useMemo(
    () => chats?.filter((chat) => chat.deleted !== true) ?? [],
    [chats]
  );

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
              <ReactionList
                reactions={messagesToTheBand}
                chats={filteredChats}
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
