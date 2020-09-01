import React, { useEffect, useRef } from "react";
import "./RadioModal.scss";

interface PropsType {
  volume: number;
  setVolume: Function;
  sound: HTMLAudioElement | undefined;
}

export const RadioModal: React.FunctionComponent<PropsType> = ({
  volume,
  setVolume,
  sound,
}) => {
  useEffect(() => {
    sound?.play();
  }, [sound]);

  const loadedInitialState = useRef(false);
  useEffect(() => {
    const storageKey = "Radio";
    if (!loadedInitialState.current) {
      try {
        const storedState = localStorage.getItem(storageKey);
        if (storedState) {
          const state = JSON.parse(storedState);
          setVolume(state.volume);
          loadedInitialState.current = true;
        }
      } catch {}
    }
    localStorage.setItem(storageKey, JSON.stringify({ volume }));
  }, [volume, setVolume, sound]);

  useEffect(() => {
    if (sound) sound.volume = volume / 100;
  }, [volume, sound]);

  return (
    <div className="radio-modal-container">
      <div className="title-radio">Shouting Fire Radio</div>
      <div className="text-radio">
        We recommend turning on the global burner radio station as you rove
        round the Playa!
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
