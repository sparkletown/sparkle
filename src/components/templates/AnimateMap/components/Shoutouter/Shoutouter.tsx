import React, { useEffect, useState } from "react";

import { useRecentWorldUsers } from "hooks/users";

import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";
import { ENTER } from "../../game/utils/Keyboard";
import KeyPoll from "../../game/utils/KeyPollSingleton";

import arrowImg from "assets/images/AnimateMap/UI/icon-send.svg";

import "./Shoutouter.scss";
export interface ShoutouterProps {}
interface IShoutouter {
  userId: string;
  msg: string;
  focused: boolean;
}
export const Shoutouter: React.FC<ShoutouterProps> = () => {
  const users = useRecentWorldUsers();
  const componentName = "UIShoutouter";
  const [state, setState] = useState({
    userId: users.recentWorldUsers[0].id,
    msg: "",
    focused: false,
  } as IShoutouter);

  const onChangeCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      userId: state.userId,
      msg: e.target.value,
      focused: state.focused,
    });
  };
  const onFocusCallback = () => {
    setState({
      userId: state.userId,
      msg: state.msg,
      focused: true,
    });
  };
  const onBlurCallback = () => {
    setState({
      userId: state.userId,
      msg: state.msg,
      focused: false,
    });
  };
  const onSendClick = () => {
    EventProvider.emit(EventType.SEND_SHOUT, state.msg);
    EventProvider.emit(EventType.RECEIVE_SHOUT, state.userId, state.msg);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    document.querySelector("." + componentName + " input").value = "";
  };

  useEffect(() => {
    const callback = (type: "down" | "up") => {
      if (type === "up" && state.focused) {
        onSendClick();
      }
    };
    KeyPoll.on(ENTER, callback);
    return () => {
      KeyPoll.off(ENTER, callback);
    };
  });

  return (
    <div className={componentName}>
      <input
        onFocus={onFocusCallback}
        onBlur={onBlurCallback}
        onChange={onChangeCallback}
        placeholder="Shout out to the playa..."
        type="text"
      />
      <div onClick={onSendClick}>
        <img src={arrowImg} alt="send" />
      </div>
    </div>
  );
};
