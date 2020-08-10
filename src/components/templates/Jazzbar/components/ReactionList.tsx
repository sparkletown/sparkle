import React, { useState } from "react";
import {
  Reaction,
  ReactionsTextMap,
} from "components/context/ExperienceContext";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";

interface ReactionListProps {
  reactions: Reaction[];
  small?: boolean;
}

const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  small = false,
}) => {
  const { usersById } = useSelector((state) => ({
    usersById: state.firestore.data.users,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

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
                usersById[message.created_by] &&
                setSelectedUserProfile({
                  ...usersById[message.created_by],
                  id: message.created_by,
                })
              }
              key={`${message.created_by}-messaging-the-band`}
              className="profile-icon"
              src={
                usersById[message.created_by]?.pictureUrl ||
                DEFAULT_PROFILE_IMAGE
              }
              title={usersById[message.created_by]?.partyName}
              alt={`${usersById[message.created_by]?.partyName} profile`}
              width={profileImageSize}
              height={profileImageSize}
            />
            <div className="partyname-bubble">
              {usersById[message.created_by]?.partyName || DEFAULT_PARTY_NAME}
            </div>
            <div
              className={`message-bubble ${
                message.reaction === "messageToTheBand" ? "" : "emoji"
              }`}
            >
              {message.reaction === "messageToTheBand"
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
