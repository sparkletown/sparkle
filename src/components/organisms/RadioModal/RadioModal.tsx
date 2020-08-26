import React, { useEffect } from "react";
import "./RadioModal.scss";

const sound = new Audio("http://bmir-ice.streamguys.com/live");

interface PropsType {
  volume: number;
  setVolume: Function;
}

export const RadioModal: React.FunctionComponent<PropsType> = ({
  volume,
  setVolume,
}) => {
  useEffect(() => {
    sound.play();
  }, []);

  useEffect(() => {
    sound.volume = volume / 100;
  }, [volume]);

  return (
    <div className="radio-modal-container">
      <div className="title-radio">Burning radio</div>
      <div className="text-radio">
        Listen to the official Burning Man Information Radio while you explore
        the Playa!
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
