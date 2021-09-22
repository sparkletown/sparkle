import React from "react";

import { ChatUser } from "types/chat";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RunTabUserInfo.scss";

export interface RunTabUserInfoProps {
  user: WithId<ChatUser>;
}

export const RunTabUserInfo: React.FC<RunTabUserInfoProps> = ({ user }) => {
  return (
    <div key={user.id} className="RunTabUserInfo">
      <UserAvatar user={user} showStatus size="small" />
      <div className="RunTabUserInfo__user">
        <div>{user.partyName}</div>
      </div>
    </div>
  );
};
