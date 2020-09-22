import React from "react";
import "./RadioModal.scss";

interface PropsType {
  volume: number;
  setVolume: Function;
  title?: string;
}

export const RadioModal: React.FunctionComponent<PropsType> = ({
  volume,
  setVolume,
  title,
}) => {
  return (
    <div className="radio-modal-container">
      <div className="title-radio">{title ?? "Playa Radio"}</div>
      <div className="text-radio">
        We recommend turning on the global burner radio station as you rove
        round the Paddock!
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
