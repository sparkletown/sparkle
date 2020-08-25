import React, { useState } from "react";
import "./RadioModal.scss";

export const RadioModal: React.FunctionComponent = () => {
  const [volume, setVolume] = useState(0);
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
        value={volume}
      />
    </div>
  );
};
