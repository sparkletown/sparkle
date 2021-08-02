import classNames from "classnames";
import React from "react";
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
