import React from "react";

import { DEFAULT_PARTY_NAME, PLAYA_AVATAR_SIZE } from "settings";

import { UserVideoState } from "types/RelayMessage";
import { User } from "types/User";

import { getLinkFromText } from "utils/getLinkFromText";
import { WithId } from "utils/id";

import AvatarImage from "./AvatarImage";
import AvatarPartygoers from "./AvatarPartygoers";
import { Shout } from "./Playa";

interface PropsType {
  useProfilePicture: boolean;
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
  useProfilePicture,
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
        <AvatarPartygoers
          useProfilePicture={useProfilePicture}
          state={{ x, y }}
          user={user}
        />
      )}
      <div
        className="avatar they"
        style={{
          top: y - PLAYA_AVATAR_SIZE / 2,
          left: x - PLAYA_AVATAR_SIZE / 2,
        }}
      >
        {!isVideoRoomOwnedByMe && (
          <div className={`avatar-name-container`}>
            {user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
          </div>
        )}
        <div className="border-helper">
          <span className="img-vcenter-helper" />
          <AvatarImage user={user} useProfilePicture={useProfilePicture} />
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
              {user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}&apos;s
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
