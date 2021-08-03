import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { ContainerClassName } from "types/utility";
import "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon.scss";

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
