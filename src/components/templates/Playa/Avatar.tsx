import React from "react";
import { UserVideoState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { PLAYA_AVATAR_SIZE } from "settings";
import { Shout } from "./Playa";
import { getLinkFromText } from "utils/getLinkFromText";

interface PropsType {
  user: WithId<User> | undefined;
  x: number;
  y: number;
  videoState: string | undefined;
  bike: boolean;
  shouts: Shout[];
  onClick: (event: React.MouseEvent) => void;
  onMouseOver: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  x,
  y,
  videoState,
  bike,
  shouts,
  onClick,
  onMouseOver,
  onMouseLeave,
}) => {
  if (!user) return <></>;

  return (
    <div
      className="avatar-container"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`avatar they ${
          videoState === UserVideoState.Open ? "chat-open" : ""
        }`}
        style={{
          top: y - PLAYA_AVATAR_SIZE / 2,
          left: x - PLAYA_AVATAR_SIZE / 2,
        }}
      >
        <span className="img-vcenter-helper" />
        <img
          className="profile-image"
          src={user.pictureUrl}
          alt={user.partyName}
          title={user.partyName}
        />
      </div>
      {user.video?.inRoomOwnedBy && (
        <div
          className="chatzone open"
          style={{
            top: y - PLAYA_AVATAR_SIZE * 1.5,
            left: x - PLAYA_AVATAR_SIZE * 1.5,
          }}
        />
      )}
      <div
        className={`mode-badge ${bike ? "bike" : "walk"}`}
        style={{
          top: y + PLAYA_AVATAR_SIZE / 3,
          left: x - PLAYA_AVATAR_SIZE / 4,
        }}
      />
      {shouts?.map((shout, index) => (
        <div
          className="shout split-words"
          style={{
            top: y,
            left: x,
          }}
          key={index}
        >
          {getLinkFromText(shout.text)}
        </div>
      ))}
    </div>
  );
};
