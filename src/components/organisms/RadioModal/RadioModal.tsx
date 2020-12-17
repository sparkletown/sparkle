import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import "./RadioModal.scss";

export interface RadioModalPropsType {
  volume: number;
  setVolume: Function;
  title?: string;
  onEnableHandler: () => void;
  isRadioPlaying: boolean;
}

export const RadioModal: React.FunctionComponent<RadioModalPropsType> = ({
  volume,
  setVolume,
  title,
  onEnableHandler,
  isRadioPlaying,
}) => {
  const handleEnableButtonClick = useCallback(() => {
    onEnableHandler();
    setVolume(volume);
  }, [onEnableHandler, setVolume, volume]);

  const renderRadioBody = () => (
    <>
      <div className="title-radio">{title ?? "Radio"}</div>
      <div className="text-radio">
        We recommend turning on the radio as you explore the map!
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
    </>
  );

  return (
    <div className="radio-modal-container">
      {!isRadioPlaying ? (
        <Button onClick={handleEnableButtonClick}>Enable radio</Button>
      ) : (
        renderRadioBody()
      )}
    </div>
  );
};
