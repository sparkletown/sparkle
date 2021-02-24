import React from "react";

import { messagesToTheBandSelector } from "utils/selectors";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useRecentVenueUsers } from "hooks/users";
import { useVenueChat } from "hooks/useVenueChat";
import { useVenueId } from "hooks/useVenueId";

import ReactionList from "components/templates/Jazzbar/components/ReactionList";

import UserList from "components/molecules/UserList";

import "./ReactionPage.scss";

export const ReactionPage = () => {
  const venueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(venueId);
  const { recentVenueUsers } = useRecentVenueUsers();
  const { messagesToDisplay } = useVenueChat();

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
  const messagesToTheBand = useSelector(messagesToTheBandSelector) ?? [];

  return (
    <div className="reaction-page-container">
      <h1 className="title">Audience Reactions</h1>

      <div className="row">
        <div className="col-8">
          <ReactionList
            reactions={messagesToTheBand}
            chats={messagesToDisplay}
          />
        </div>

        <div className="col-4">
          <UserList
            users={recentVenueUsers}
            isAudioEffectDisabled
            imageSize={50}
          />
        </div>
      </div>
    </div>
  );
};
