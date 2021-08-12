import React from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./ProfileModalRoundIcon.scss";

export interface ProfileModalRoundIconProps
  extends FontAwesomeIconProps,
    ContainerClassName {
  onClick?: () => void;
}

export const ProfileModalRoundIcon: React.FC<ProfileModalRoundIconProps> = ({
  containerClassName,
  onClick,
  ...rest
}) => {
  return (
    <div
      className={classNames("ProfileModalRoundIcon", containerClassName)}
      onClick={onClick}
    >
      <FontAwesomeIcon {...rest} />
    </div>
  );
};
