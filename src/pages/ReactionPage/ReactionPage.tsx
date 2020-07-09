import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  Reaction,
  isMessageToTheBand,
} from "components/context/ExperienceContext";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import ReactionList from "components/venues/Jazzbar/components/ReactionList";

const ReactionPage = () => {
  useConnectPartyGoers();

  const { reactions, usersById, partyGoers, venue } = useSelector(
    (state: any) => ({
      reactions: state.firestore.ordered.reactions,
      usersById: state.firestore.data.users,
      partyGoers: state.firestore.ordered.partygoers,
      venue: state.firestore.data.currentVenue,
    })
  );

  useFirestoreConnect([
    {
      collection: "experiences",
      doc: venue.name,
      subcollections: [{ collection: "reactions" }],
      storeAs: "reactions",
      orderBy: ["created_at", "desc"],
    },
  ]);

  const typedReaction = (reactions ? reactions : []) as Reaction[];

  const messagesToTheBand = typedReaction.filter(isMessageToTheBand);

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container reaction-page-container">
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
