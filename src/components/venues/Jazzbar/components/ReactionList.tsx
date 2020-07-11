import React, { useState } from "react";
import {
  Reaction,
  isMessageToTheBand,
  ReactionsTextMap,
} from "components/context/ExperienceContext";
import { useSelector } from "react-redux";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";

import "./ReactionList.scss";

interface ReactionListProps {
  reactions: Reaction[];
  small?: boolean;
}

const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  small = false,
}) => {
  const { usersById } = useSelector((state: any) => ({
    usersById: state.firestore.data.users,
  })) as {
    usersById: { [key: string]: Omit<User, "id"> };
  };
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  const profileImageSize = small ? 40 : 50;
  return (
    <>
      <div className={`reaction-list ${small && "small"}`}>
        {reactions.map((message) => (
          <div
            className="message"
            key={`${message.created_by}-${message.created_at}`}
          >
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
              width={profileImageSize}
              height={profileImageSize}
            />
            <div className="partyname-bubble">
              {usersById[message.created_by].partyName}:
            </div>
            <div
              className={`message-bubble ${
                isMessageToTheBand(message) ? "" : "emoji"
              }`}
            >
              {isMessageToTheBand(message)
                ? message.text
                : ReactionsTextMap[message.reaction]}
            </div>
          </div>
        ))}
      </div>
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </>
  );
};

export default ReactionList;
