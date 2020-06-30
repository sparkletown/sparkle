import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  Reaction,
  MessageToTheBandReaction,
  isMessageToTheBand,
} from "components/context/ExperienceContext";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";

const ReactionPage = () => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  useFirestoreConnect([
    {
      collection: "experiences",
      doc: "kansassmittys",
      subcollections: [{ collection: "reactions" }],
      storeAs: "reactions",
      orderBy: ["created_at", "desc"],
    },
  ]);

  useConnectPartyGoers();

  const { reactions, usersById, partyGoers } = useSelector((state: any) => ({
    reactions: state.firestore.ordered.reactions,
    usersById: state.firestore.data.users,
    partyGoers: state.firestore.ordered.partygoers,
  }));

  const typedReaction = (reactions ? reactions : []) as Reaction[];

  const messagesToTheBand = typedReaction.filter(isMessageToTheBand);

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container reaction-page-container">
        <h1 className="title">Reactions to the live</h1>
        <div className="row">
          <div className="col-8">
            {usersById &&
              messagesToTheBand &&
              messagesToTheBand.map((message: MessageToTheBandReaction) => (
                <div className="message">
                  <img
                    onClick={() =>
                      setSelectedUserProfile({
                        ...usersById[message.created_by],
                        id: message.created_by,
                      })
                    }
                    key={`${message.created_by}-messaging-the-band`}
                    className="profile-icon"
                    src={
                      usersById[message.created_by].pictureUrl ||
                      "/anonymous-profile-icon.jpeg"
                    }
                    title={usersById[message.created_by].partyName}
                    alt={`${usersById[message.created_by].partyName} profile`}
                    width={50}
                    height={50}
                  />
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))}
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
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </WithNavigationBar>
  );
};

export default ReactionPage;
