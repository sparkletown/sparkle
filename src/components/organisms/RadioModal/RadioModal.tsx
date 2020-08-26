import React, { useEffect, useMemo } from "react";
import "./RadioModal.scss";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  volume: number;
  setVolume: Function;
}

export const RadioModal: React.FunctionComponent<PropsType> = ({
  volume,
  setVolume,
}) => {
  const { radioStations } = useSelector((state) => ({
    radioStations: state.firestore.data.venues?.playa?.radioStations,
  }));

  const sound = useMemo(
    () => (radioStations ? new Audio(radioStations[0]) : undefined),
    [radioStations]
  );

  useEffect(() => {
    sound?.play();
  }, [sound]);

  useEffect(() => {
    if (sound) sound.volume = volume / 100;
  }, [volume, sound]);

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
