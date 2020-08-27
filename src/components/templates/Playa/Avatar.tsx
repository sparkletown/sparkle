import React from "react";
import { UserVideoState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { PLAYA_AVATAR_SIZE } from "settings";
import OverlayMenu from "components/molecules/OverlayMenu";
import { MenuConfig } from "components/molecules/OverlayMenu/OverlayMenu";

interface PropsType {
  user: WithId<User> | undefined;
  x: number;
  y: number;
  videoState: string | undefined;
  bike: boolean;
  setHoveredUser: (user: User | null) => void;
  setHovered: (hovered: boolean) => void;
  hoveredRef: React.Ref<HTMLDivElement>;
  menu: MenuConfig;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  x,
  y,
  videoState,
  bike,
  setHoveredUser,
  setHovered,
  hoveredRef,
  menu,
}) => {
  if (!user) return <></>;

  return (
    <OverlayMenu config={menu}>
      <>
        <div
          className="avatar they"
          style={{
            top: y - PLAYA_AVATAR_SIZE / 2,
            left: x - PLAYA_AVATAR_SIZE / 2,
          }}
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
        {videoState && (
          <div
            className={`chatzone ${
              videoState === UserVideoState.Locked ? "locked" : ""
            }
        ${videoState === UserVideoState.Open ? "open" : ""}`}
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
      </>
    </OverlayMenu>
  );
};
