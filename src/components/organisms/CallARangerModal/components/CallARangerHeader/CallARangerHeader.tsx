import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { ButtonNG } from "components/atoms/ButtonNG";

import rangersImage from "assets/images/CallARanger/rangers.png";

import "./CallARangerHeader.scss";

export interface CallARangerHeaderProps extends ContainerClassName {
  onCloseClick: () => void;
}

export const CallARangerHeader: React.FC<CallARangerHeaderProps> = ({
  onCloseClick,
  containerClassName,
}) => {
  return (
    <div className={classNames("CallARangerHeader", containerClassName)}>
      <img
        src={rangersImage}
        className="CallARangerHeader__img"
        alt="rangers"
      />
      <div className="CallARangerHeader__inner-container">
        <h2>Call a Ranger</h2>
        <h5 className="CallARangerHeader__quote">
          {
            "\"Rangers rise from dust when they're needed and recede when they're done.\""
          }
        </h5>
      </div>
      <div className="CallARangerHeader__close">
        <ButtonNG
          className="CallARangerHeader__close-button"
          iconName={faTimes}
          onClick={onCloseClick}
          iconOnly
          iconSize={"1x"}
        />
      </div>
    </div>
  );
};
