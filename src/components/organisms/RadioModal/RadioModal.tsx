import React, { useCallback } from "react";
import { Button } from "react-bootstrap";

import { VolumeControl } from "components/atoms/VolumeControl";

import "./RadioModal.scss";

export interface RadioModalPropsType {
  volume: number;
  setVolume: (volume: number) => void;
  onMute: () => void;
  title?: string;
  onEnableHandler: () => void;
  isRadioPlaying: boolean;
}

export const RadioModal: React.FunctionComponent<RadioModalPropsType> = ({
  volume,
  setVolume,
  onMute,
  onEnableHandler,
  isRadioPlaying,
}) => {
  const handleEnableButtonClick = useCallback(() => {
    onEnableHandler();
    setVolume(volume);
  }, [onEnableHandler, setVolume, volume]);

  const renderRadioBody = () => (
    <>
      <div className="text-radio">
        We recommend turning on the radio as you explore the map!
      </div>
      <img className="img-radio" src="/radio-icon-color.png" alt="radio icon" />
      <VolumeControl
        withSlider
        withMute
        volume={volume}
        onVolume={setVolume}
        onMute={onMute}
        name="vol"
      />
    </>
  );

  return (
    <div role="dialog" className="radio-modal-container">
      {!isRadioPlaying ? (
        <Button onClick={handleEnableButtonClick}>Enable radio</Button>
      ) : (
        renderRadioBody()
      )}
    </div>
  );
};
