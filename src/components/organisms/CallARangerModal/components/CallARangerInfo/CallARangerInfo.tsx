import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import badgeImage from "assets/images/CallARanger/badge.png";

import "./CallARangerInfo.scss";

export interface CallARangerInfoProps extends ContainerClassName {
  title: string;
}

export const CallARangerInfo: React.FC<
  PropsWithChildren<CallARangerInfoProps>
> = ({ title, children, containerClassName }) => {
  return (
    <div className={classNames("CallARangerInfo", containerClassName)}>
      <img src={badgeImage} className="CallARangerInfo__img" alt="badge" />
      <h4>{title}</h4>
      {children}
    </div>
  );
};
