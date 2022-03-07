import React, { useMemo } from "react";
import classNames from "classnames";

import { generateId } from "utils/string";

import { RadioModal } from "components/organisms/RadioModal/RadioModal";

import { Popover } from "components/molecules/Popover";

import { ButtonNG } from "components/atoms/ButtonNG";

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

  const renderedOverlay = useMemo(
    () => (
      <div id={id} className={popoverClasses}>
        <RadioModal
          volume={volume}
          setVolume={setVolume}
          title={title}
          onEnableHandler={onEnableHandler}
          isRadioPlaying={radioPlaying}
        />
      </div>
    ),
    [
      id,
      popoverClasses,
      volume,
      setVolume,
      title,
      onEnableHandler,
      radioPlaying,
    ]
  );

  return (
    <Popover overlay={renderedOverlay} defaultShow={defaultShow} closeRoot>
      <ButtonNG className={buttonClasses} />
    </Popover>
  );
};
