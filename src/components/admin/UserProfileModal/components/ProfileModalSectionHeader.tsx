import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

export interface ProfileModalSectionHeaderProps extends ContainerClassName {
  text: string;
}

export const ProfileModalSectionHeader: React.FC<ProfileModalSectionHeaderProps> = ({
  text,
  containerClassName,
}) => {
  return (
    <div
      className={classNames("ProfileModalSectionHeader", containerClassName)}
    >
      {text}
    </div>
  );
};
