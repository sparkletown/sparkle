import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { ButtonNG } from "components/atoms/ButtonNG";

import CallARangerIcon from "assets/icons/call-a-ranger.svg";

import "./CallARangerButton.scss";

export interface CallARangerButtonProps extends ContainerClassName {
  onClick: () => void;
}

export const CallARangerButton: React.FC<CallARangerButtonProps> = ({
  onClick,
  containerClassName,
}) => {
  return (
    <ButtonNG
      className={classNames("CallARangerButton", containerClassName)}
      onClick={onClick}
      iconOnly
    >
      <img src={CallARangerIcon} alt="Call a ranger" />
    </ButtonNG>
  );
};
