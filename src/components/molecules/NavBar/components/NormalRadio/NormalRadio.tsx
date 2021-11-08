import React, { useMemo } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import classNames from "classnames";

import { generateId } from "utils/string";

import { RadioModal } from "components/organisms/RadioModal/RadioModal";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./NormalRadio.scss";

interface NormalRadioProps {
  volume: number;
  setVolume: (value: ((prevState: number) => number) | number) => void;
  title?: string;
  onEnableHandler: () => void;
  radioPlaying: boolean;
  defaultShow: boolean;
}

export const NormalRadio: React.FC<NormalRadioProps> = ({
  title,
  defaultShow,
  onEnableHandler,
  radioPlaying,
  volume,
  setVolume,
}) => {
  const id = useMemo(() => generateId("NormalRadio-popover"), []);

  const popoverClasses = classNames({
    "NormalRadio NormalRadio--on": radioPlaying && volume,
    "NormalRadio NormalRadio--off": !(radioPlaying && volume),
  });
  const buttonClasses = classNames({
    "NormalRadio__button NormalRadio__button--on": radioPlaying && volume,
    "NormalRadio__button NormalRadio__button--off": !(radioPlaying && volume),
  });

  const popoverStyle = useMemo(
    () => ({
      // @debt remove the popover style from global.scss, then remove this workaround
      height: "fit-content",
    }),
    []
  );

  const renderedOverlay = useMemo(
    () => (
      <Popover id={id} className={popoverClasses} style={popoverStyle}>
        <Popover.Content>
          <RadioModal
            volume={volume}
            setVolume={setVolume}
            title={title}
            onEnableHandler={onEnableHandler}
            isRadioPlaying={radioPlaying}
          />
        </Popover.Content>
      </Popover>
    ),
    [
      id,
      popoverClasses,
      popoverStyle,
      volume,
      setVolume,
      title,
      onEnableHandler,
      radioPlaying,
    ]
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      overlay={renderedOverlay}
      rootClose
      defaultShow={defaultShow}
    >
      <ButtonNG className={buttonClasses} />
    </OverlayTrigger>
  );
};
