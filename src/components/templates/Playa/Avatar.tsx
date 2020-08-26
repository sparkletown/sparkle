import React from "react";
import {
  UserState,
  UserStateKey,
  stateBoolean,
  UserVideoState,
} from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { PLAYA_AVATAR_SIZE } from "settings";

interface PropsType {
  user: WithId<User> | undefined;
  state: UserState;
  setSelectedUserProfile: (user: WithId<User>) => void;
  setHoveredUser: (user: User | null) => void;
  setHovered: (hovered: boolean) => void;
  hoveredRef: React.Ref<HTMLDivElement>;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  state,
  setSelectedUserProfile,
  setHoveredUser,
  setHovered,
  hoveredRef,
}) => {
  if (!user) return <></>;

  return (
    <>
      <div
        className="avatar they"
        style={{
          top: state.y - PLAYA_AVATAR_SIZE / 2,
          left: state.x - PLAYA_AVATAR_SIZE / 2,
        }}
        onClick={() => setSelectedUserProfile(user)}
        onMouseOver={() => {
          setHoveredUser(user);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        ref={hoveredRef}
      >
        <span className="img-vcenter-helper" />
        <img
          className="profile-image"
          src={user.pictureUrl}
          alt={user.partyName}
          title={user.partyName}
        />
      </div>
      <div
        className={`chatzone ${
          state?.state?.[UserStateKey.Video] === UserVideoState.Locked
            ? "locked"
            : ""
        }
        ${
          state?.state?.[UserStateKey.Video] === UserVideoState.Open
            ? "open"
            : ""
        }`}
        style={{
          top: state.y - PLAYA_AVATAR_SIZE * 1.5,
          left: state.x - PLAYA_AVATAR_SIZE * 1.5,
        }}
      />
      {stateBoolean(state, UserStateKey.Bike) && (
        <div
          className="bike"
          style={{
            top: state.y + PLAYA_AVATAR_SIZE / 5,
            left: state.x + PLAYA_AVATAR_SIZE / 5,
          }}
        />
      )}
    </>
  );
};
