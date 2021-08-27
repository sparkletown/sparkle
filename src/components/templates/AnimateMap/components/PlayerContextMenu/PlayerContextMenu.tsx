import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const selfRef = useRef<HTMLDivElement>(null);

  const onReplicatedUserClickHandler = useCallback(
    (user: ReplicatedUser, viewportX: number, viewportY: number) => {
      setState({ userId: "", isShown: false, posX: -200, posY: -200 });
      if (!selfRef.current?.parentElement?.parentElement) return;

      const viewportWidth =
        selfRef.current.parentElement.parentElement.offsetWidth;
      const viewportHeight =
        selfRef.current.parentElement.parentElement.offsetHeight;
      const posX =
        viewportX + selfRef.current.clientWidth > viewportWidth
          ? viewportWidth - selfRef.current.clientWidth
          : viewportX;
      const posY =
        viewportY - selfRef.current.clientHeight < 0
          ? viewportHeight - selfRef.current.clientHeight
          : viewportHeight - viewportY;
      setState({
        userId: user.data.id,
        isShown: true,
        posX,
        posY,
      });
    },
    [selfRef]
  );

  const closeMenu = () => {
    setState({ userId: "", isShown: false, posX: -200, posY: -200 });
  };

  const videoChatHandler = () => {
    console.log("start video chat", state.userId);
    closeMenu();
  };

  const sendMessageHandler = () => {
    console.log("start video chat", state.userId);
    closeMenu();
  };
  const viewProfileHandler = () => {
    console.log("start video chat", state.userId);
    closeMenu();
  };

  useEffect(() => {
    EventProvider.on(
      EventType.ON_REPLICATED_USER_CLICK,
      onReplicatedUserClickHandler
    );
    return () => {
      EventProvider.off(
        EventType.ON_REPLICATED_USER_CLICK,
        onReplicatedUserClickHandler
      );
    };
  }, [onReplicatedUserClickHandler]);

  return (
    <div
      ref={selfRef}
      className={
        state.isShown ? "UIPlayerContextMenu" : "UIPlayerContextMenuHidden"
      }
      style={{
        left: state.posX + "px",
        bottom: state.posY + "px",
        animationPlayState: "play",
      }}
    >
      <div onClick={videoChatHandler}>Video Chat</div>
      <div onClick={sendMessageHandler}>Send Message</div>
      <div onClick={viewProfileHandler}>View Profile</div>
    </div>
  );
};
