import React from "react";
import classNames from "classnames";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

import { ContainerClassName } from "types/utility";

import "./ProfileModalRoundIcon.scss";

interface Props extends FontAwesomeIconProps, ContainerClassName {
  onClick?: () => void;
}

export const ProfileModalRoundIcon: React.FC<Props> = ({
  containerClassName,
  onClick,
  ...rest
}: Props) => {
  return (
    <div
      className={classNames("ProfileModalRoundIcon", containerClassName)}
      onClick={onClick}
    >
      <FontAwesomeIcon {...rest} />
    </div>
  );
};
