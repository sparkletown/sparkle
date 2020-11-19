import React from "react";
import { PLAYA_VENUE_NAME } from "settings";
import "./RadioModal.scss";

export interface RadioModalPropsType {
  volume: number;
  setVolume: Function;
  title?: string;
}

export const RadioModal: React.FunctionComponent<RadioModalPropsType> = ({
  volume,
  setVolume,
  title,
}) => {
  return (
    <div className="radio-modal-container">
      <div className="title-radio">{title ?? `${PLAYA_VENUE_NAME} Radio`}</div>
      <div className="text-radio">
        We recommend turning on the global burner radio station as you rove
        round the {PLAYA_VENUE_NAME}!
      </div>
      <img
        className="img-radio"
        src={"/radio-icon-color.png"}
        alt="radio-icon"
      />
      <input
        type="range"
        id="vol"
        name="vol"
        min="0"
        max="100"
        onChange={(ev) => setVolume(Number(ev.target.value))}
        value={volume}
      />
    </div>
  );
};
