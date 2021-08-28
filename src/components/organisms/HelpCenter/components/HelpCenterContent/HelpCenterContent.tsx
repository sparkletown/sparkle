import React, { useCallback } from "react";
import classNames from "classnames";

import { HELP_CENTER_URL, VEST_RANGERS_URL, VPLAYA_URL } from "settings";

import { ContainerClassName } from "types/utility";

import { InfoBlock } from "../InfoBlock";

import SparkleLogo from "assets/images/CallARanger/sparkle.png";
import VestLogo from "assets/images/CallARanger/vest.png";
import VplayaLogo from "assets/images/CallARanger/vplaya.png";

import "components/organisms/HelpCenter/components/HelpCenterContent/HelpCenterContent.scss";

export interface HelpContentProps extends ContainerClassName {
  onHelpClicked: (url: string) => void;
}

export const HelpCenterContent: React.FC<HelpContentProps> = ({
  onHelpClicked,
  containerClassName,
}) => {
  const onGeneralHelpClicked = useCallback(() => {
    onHelpClicked(HELP_CENTER_URL);
  }, [onHelpClicked]);

  const onVestClicked = useCallback(() => {
    onHelpClicked(VEST_RANGERS_URL);
  }, [onHelpClicked]);

  const onVplayaClicked = useCallback(() => {
    onHelpClicked(VPLAYA_URL);
  }, [onHelpClicked]);

  return (
    <div className={classNames("HelpCenterContent", containerClassName)}>
      <h3>How can we help?</h3>
      <div className="HelpCenterContent__info-container">
        <InfoBlock
          column={1}
          imgSrc={SparkleLogo}
          onClick={onGeneralHelpClicked}
          title="Sparkle Help"
          buttonText="Sparkle Help"
          text="Need technical help from the SparkleVerse team? Look no further. Dive into our knowledge base or get in contact with our team."
        />
        <InfoBlock
          column={2}
          imgSrc={VestLogo}
          onClick={onVestClicked}
          title="VEST Rangers"
          buttonText="Call a Ranger"
          text="Need support? VEST Rangers offer nonjudgemental, compassionate emotional support and peer mediation to anyone in need via video, voice or chat."
        />
        <InfoBlock
          column={3}
          imgSrc={VplayaLogo}
          onClick={onVplayaClicked}
          title="Playa Info"
          buttonText="Playa Info Camp"
          text='Got questions? We\&apos;ve got answers! Head over to Virtual Playa Info to interface with one of our Oracles or just stop by to chat and say, "Hello!"'
        />
      </div>
    </div>
  );
};
