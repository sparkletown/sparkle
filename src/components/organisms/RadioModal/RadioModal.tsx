import React, { useEffect } from "react";
import "./RadioModal.scss";

const sound = new Audio(
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
);

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
      <iframe
        title="burning-man-radio"
        allow="autoplay"
        width="100%"
        height="200"
        src="https://www.iheart.com/podcast/269-burning-man-live-63444432/episode/burning-in-a-virtual-universe-70395877/?embed=true"
        frameBorder="0"
      ></iframe>
    </div>
  );
};
