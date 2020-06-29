import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { ReactionType, Reaction } from "components/context/ExperienceContext";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import "./ReactionPage.scss";
import UserList from "components/molecules/UserList";
import UserProfilePicture from "components/molecules/UserProfilePicture";
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
    },
  ]);

  useConnectPartyGoers();

  const { reactions, users } = useSelector((state: any) => ({
    reactions: state.firestore.ordered.reactions,
    users: state.firestore.ordered.partygoers,
  }));

  const messagesToTheBand =
    reactions &&
    reactions
      .filter((r: Reaction) => r.reaction === ReactionType.messageToTheBand)
      .sort((a: Reaction, b: Reaction) => b.created_at - a.created_at);

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container reaction-page-container">
        <h1 className="title">Reactions to the live</h1>
        <div className="row">
          <div className="col-8">
            {users &&
              messagesToTheBand &&
              messagesToTheBand.map((message: Reaction) => (
                <div className="message">
                  <UserProfilePicture
                    user={users.find(
                      (user: User) => user.id === message.created_by
                    )}
                    imageSize={50}
                    setSelectedUserProfile={(userProfile) =>
                      setSelectedUserProfile(userProfile)
                    }
                  />
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))}
          </div>
          {users && (
            <div className="col-4">
              <UserList users={users} />
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
