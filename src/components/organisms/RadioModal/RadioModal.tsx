import React from "react";
import { Button } from "react-bootstrap";
import { PLAYA_VENUE_NAME } from "settings";
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
  const handleEnableButtonClick = () => {
    onEnableHandler();
    // Volume is randomized because if it is set to the same number as before
    // the radio will not start playing
    const volume = 20 + Math.random(); // i.e. 20 + 0.3

    setVolume(volume);
  };

  const renderEnableRadioButton = () => (
    <Button onClick={() => handleEnableButtonClick()}>Enable radio</Button>
  );

  const renderRadioBody = () => (
    <>
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
    </>
  );

  return (
    <div className="radio-modal-container">
      {!isRadioPlaying && renderEnableRadioButton()}

      {isRadioPlaying && renderRadioBody()}
    </div>
  );
};
