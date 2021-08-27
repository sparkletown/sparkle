import React, { useEffect, useState } from "react";

// import { useDispatch } from "hooks/useDispatch";
import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";

import "./PlayerContextMenu.scss";
export interface UIContextMenuProps {}

interface IPlayerContextMenu {
  isShown: boolean;
  posX: number;
  posY: number;
}

export const UIPlayerContextMenu: React.FC<UIContextMenuProps> = () => {
  const [state, setState] = useState({
    isShown: false,
    posX: 0,
    posY: 0,
  } as IPlayerContextMenu);
  // const dispatch = useDispatch();
  const eventProvider = EventProvider;
  useEffect(() => {
    const callback = (
      isShown: boolean,
      x: number,
      y: number,
      viewportWidth: number,
      viewportHeight: number
    ) => {
      setState({ isShown: false, posX: -200, posY: -200 });
      setTimeout(() => {
        const element = document.querySelector(".UIPlayerContextMenuHidden");
        if (element) {
          const posX =
            x + element?.clientWidth > viewportWidth
              ? viewportWidth - element.clientWidth
              : x;
          const posY =
            y - element?.clientHeight < 0
              ? viewportHeight - element?.clientHeight
              : viewportHeight - y;
          setState({
            isShown,
            posX,
            posY,
          });
        }
      }, 20);
    };

    eventProvider.on(EventType.UI_PLAYER_CLICK, callback);

    return () => {
      eventProvider.off(EventType.UI_PLAYER_CLICK, callback);
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
