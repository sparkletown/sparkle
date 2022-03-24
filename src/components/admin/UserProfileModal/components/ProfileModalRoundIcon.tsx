import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

export interface ProfileModalRoundIconProps
  extends ContainerClassName,
    Pick<ButtonProps, "iconName" | "iconSize"> {
  onClick?: () => void;
}

export const ProfileModalRoundIcon: React.FC<ProfileModalRoundIconProps> = ({
  containerClassName,
  onClick,
  iconName,
  iconSize,
}) => {
  return (
    <ButtonNG
      className={classNames("ProfileModalRoundIcon", containerClassName)}
      onClick={onClick}
      iconOnly
      iconName={iconName}
      iconSize={iconSize}
    />
  );
};
