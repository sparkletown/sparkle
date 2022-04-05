import React, { useCallback, useEffect, useRef } from "react";

import { EventProvider, EventType } from "../../../EventProvider";
import { ENTER } from "../../game/utils/Keyboard";
import KeyPoll from "../../game/utils/KeyPollSingleton";

import arrowImg from "assets/images/AnimateMap/UI/icon-send.svg";

import "./Shoutouter.scss";

export interface ShoutouterProps {}

export const Shoutouter: React.FC<ShoutouterProps> = () => {
  const refInput = useRef<HTMLInputElement>(null);

  const onSendClick = useCallback(() => {
    if (!refInput.current) return;
    EventProvider.emit(EventType.SEND_SHOUT, refInput.current.value);
    refInput.current.value = "";
    refInput.current.blur();
  }, [refInput]);

  const onEnterPressed = useCallback(
    (type: "down" | "up") => {
      if (type === "up" && refInput.current === document.activeElement) {
        onSendClick();
      }
    },
    [onSendClick, refInput]
  );

  useEffect(() => {
    KeyPoll.on(ENTER, onEnterPressed);
    return () => {
      KeyPoll.off(ENTER, onEnterPressed);
    };
  });

  return (
    <div className="UIShoutouter">
      <input
        ref={refInput}
        placeholder="Shout out to the playa..."
        type="text"
        maxLength={140}
      />
      <div onClick={onSendClick}>
        <img src={arrowImg} alt="send" />
      </div>
    </div>
  );
};
