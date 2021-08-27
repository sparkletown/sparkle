import React, { useEffect, useState } from "react";

import { ReplicatedUser } from "store/reducers/AnimateMap";

import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";

import "./PlayerContextMenu.scss";
export interface UIContextMenuProps {}

interface IPlayerContextMenu {
  userId: string;
  isShown: boolean;
  posX: number;
  posY: number;
}

export const UIPlayerContextMenu: React.FC<UIContextMenuProps> = () => {
  const [state, setState] = useState({
    userId: "",
    isShown: false,
    posX: 0,
    posY: 0,
  } as IPlayerContextMenu);
  const eventProvider = EventProvider;
  useEffect(() => {
    const callback = (
      user: ReplicatedUser,
      viewportX: number,
      viewportY: number,
    ) => {
      setState({ userId: "", isShown: false, posX: -200, posY: -200 });
      setTimeout(() => {
        const element = document.querySelector(".UIPlayerContextMenuHidden");

        if (!element?.parentElement?.parentElement) return;

        const viewportWidth = element.parentElement.parentElement.offsetWidth;
        const viewportHeight = element.parentElement.parentElement.offsetHeight;
        const posX =
          viewportX + element.clientWidth > viewportWidth
            ? viewportWidth - element.clientWidth
            : viewportX;
        const posY =
          viewportY - element.clientHeight < 0
            ? viewportHeight - element.clientHeight
            : viewportHeight - viewportY;
        setState({
          userId: user.data.id,
          isShown: true,
          posX,
          posY,
        });

      }, 20);
    };

    eventProvider.on(EventType.ON_REPLICATED_USER_CLICK, callback);

    return () => {
      eventProvider.off(EventType.ON_REPLICATED_USER_CLICK, callback);
    };
  });
  return (
    <div
      className={
        state.isShown ? "UIPlayerContextMenu" : "UIPlayerContextMenuHidden"
      }
      style={{
        left: state.posX + "px",
        bottom: state.posY + "px",
        animationPlayState: "play",
      }}
    >
      <div>Video Chat</div>
      <div>Send Message</div>
      <div>View Profile</div>
    </div>
  );
};
