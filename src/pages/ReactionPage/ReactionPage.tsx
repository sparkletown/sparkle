import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useFirestoreConnect } from "react-redux-firebase";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import ReactionList from "components/venues/Jazzbar/components/ReactionList";
import { useSelector } from "hooks/useSelector";
import { MessageToTheBandReaction } from "components/context/ExperienceContext";
import { OrderedIdEnhancer } from "types/Firestore";

const ReactionPage = () => {
  useConnectPartyGoers();

  const { reactions, usersById, partyGoers, venue } = useSelector((state) => ({
    reactions: state.firestore.ordered.reactions,
    usersById: state.firestore.data.users,
    partyGoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));

  useFirestoreConnect([
    {
      collection: "experiences",
      doc: venue.name,
      subcollections: [{ collection: "reactions" }],
      storeAs: "reactions",
      orderBy: ["created_at", "desc"],
    },
  ]);

  const messagesToTheBand = reactions.filter(
    (reaction) => reaction.reaction === "messageToTheBand"
  ) as Array<OrderedIdEnhancer<MessageToTheBandReaction>>;

  return (
    <WithNavigationBar>
      <div className="full-page-container reaction-page-container">
        <h1 className="title">Audience Reactions</h1>
        <div className="row">
          <div className="col-8">
            {usersById && messagesToTheBand && (
              <ReactionList reactions={messagesToTheBand} />
            )}
          </div>
          {partyGoers && (
            <div className="col-4">
              <UserList
                users={partyGoers}
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
