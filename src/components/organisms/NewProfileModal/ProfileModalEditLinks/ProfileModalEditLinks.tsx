import classNames from "classnames";
import React from "react";
import { ContainerClassName } from "types/utility";

interface Props extends ContainerClassName {}

export const ProfileModalEditLinks: React.FC<Props> = ({
  containerClassName,
}: Props) => {
  return (
    <div className={classNames("ProfileModalEditLinks", containerClassName)}>
      edit links
    </div>
  );
};
