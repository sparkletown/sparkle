import React, { ChangeEventHandler, useCallback, useMemo } from "react";

import { generateId } from "utils/string";

import { ButtonNG } from "components/atoms/ButtonNG";

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
  const id = useMemo(() => generateId("RadioModal-vol"), []);

  const handleEnableClick = useCallback(() => {
    onEnableHandler();
    setVolume(volume);
  }, [onEnableHandler, setVolume, volume]);

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (ev) => setVolume(Number(ev.target?.value)),
    [setVolume]
  );

  return (
    <div role="dialog" className="RadioModal">
      {!isRadioPlaying ? (
        <ButtonNG variant="primary" onClick={handleEnableClick}>
          Enable radio
        </ButtonNG>
      ) : (
        <>
          <div className="RadioModal__title-radio">{title ?? "Radio"}</div>
          <div className="RadioModal__text-radio">
            We recommend turning on the radio as you explore the map!
          </div>
          <img
            className="RadioModal__img-radio"
            src={"/radio-icon-color.png"}
            alt="radio-icon"
          />
          <input
            id={id}
            value={volume}
            onChange={handleVolumeChange}
            type="range"
            name="vol"
            min="0"
            max="100"
          />
        </>
      )}
    </div>
  );
};
