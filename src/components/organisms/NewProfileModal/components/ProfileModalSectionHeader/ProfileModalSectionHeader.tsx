import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./ProfileModalSectionHeader.scss";

interface Props extends ContainerClassName {
  text: string;
}

export const ProfileModalSectionHeader: React.FC<Props> = ({
  text,
  containerClassName,
}: Props) => {
  return (
    <div
      className={classNames("ProfileModalSectionHeader", containerClassName)}
    >
      {text}
    </div>
  );
};
