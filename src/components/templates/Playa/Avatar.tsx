import React from "react";
import { UserVideoState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { PLAYA_AVATAR_SIZE } from "settings";
import { Shout } from "./Playa";
import { getLinkFromText } from "utils/getLinkFromText";
import AvatarPartygoers from "./AvatarPartygoers";
import AvatarImage from "./AvatarImage";

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

  const isVideoRoomOwnedByMe = user.video?.inRoomOwnedBy === user.id;

  return (
    <div
      className="avatar-container"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {isVideoRoomOwnedByMe && (
        <AvatarPartygoers state={{ x, y }} user={user} />
      )}
      <div
        className="avatar they"
        style={{
          top: y - PLAYA_AVATAR_SIZE / 2,
          left: x - PLAYA_AVATAR_SIZE / 2,
        }}
      >
        {!isVideoRoomOwnedByMe && (
          <div className={`avatar-name-container`}>{user.partyName}</div>
        )}
        <div className="border-helper">
          <span className="img-vcenter-helper" />
          <AvatarImage user={user} />
        </div>
      </div>
      {(videoState || isVideoRoomOwnedByMe) && (
        <div
          className={`chatzone ${
            videoState === UserVideoState.Locked ? "locked" : ""
          }
            ${
              (videoState === UserVideoState.Open &&
                !user.video?.inRoomOwnedBy) ||
              !videoState
                ? "open-other"
                : ""
            } ${
            isVideoRoomOwnedByMe
              ? "busy-me"
              : user.video?.inRoomOwnedBy
              ? "busy"
              : ""
          }
            `}
          style={{
            top: y - PLAYA_AVATAR_SIZE * 1.5,
            left: x - PLAYA_AVATAR_SIZE * 1.5,
          }}
        >
          {isVideoRoomOwnedByMe && (
            <div className="video_chat-status">
              {user.partyName}&apos;s
              <br />
              live video chat
            </div>
          )}
        </div>
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
