import React from "react";

import { SHOW_EMOJI_IN_REACTION_PAGE } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";
import { messagesToTheBandSelector, reactionsSelector } from "utils/selectors";

import { useVenueChat } from "hooks/chats/venueChat";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { UserList } from "components/molecules/UserList";

import { ReactionList } from "./ReactionList";

import "./ReactionPage.scss";

const emptyUsersList: WithId<User>[] = [];

const wantedReactionsSelector = SHOW_EMOJI_IN_REACTION_PAGE
  ? reactionsSelector
  : messagesToTheBandSelector;

// @debt pass venue through the props
export const ReactionPage: React.FC = () => {
  const venueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(venueId);
  const { messagesToDisplay: venueChatMessages } = useVenueChat(venueId);

  // @debt this is very similar to the query in src/hooks/reactions.tsx, but that filters by createdAt > now
  useFirestoreConnect(
    currentVenue
      ? {
          collection: "experiences",
          doc: currentVenue.id,
          subcollections: [{ collection: "reactions" }],
          orderBy: ["created_at", "desc"],
          storeAs: "reactions",
        }
      : undefined
  );
  const reactions = useSelector(wantedReactionsSelector) ?? [];

  return (
    <div className="reaction-page-container">
      <h1 className="title">Audience Reactions</h1>

      <div className="row">
        <div className="col-8">
          <ReactionList
            reactions={reactions}
            chatMessages={venueChatMessages}
          />
        </div>

        <div className="col-4">
          <UserList
            users={currentVenue?.recentUsersSample ?? emptyUsersList}
            showEvenWhenNoUsers
          />
        </div>
      </div>
    </div>
  );
};
