import React from "react";
import classNames from "classnames";

import "./InformationCard.scss";
import { ContainerClassName } from "../../../types/utility";

export interface InformationCardProps extends ContainerClassName {
  title: string;
  children: React.ReactNode;
}

const InformationCard: React.FC<InformationCardProps> = ({
  title,
  children,
  containerClassName,
}) => (
  <div className={classNames("information-card-container", containerClassName)}>
    <h4 className="title">{title}</h4>
    <div className="information-card-text">{children}</div>
  </div>
);

export default InformationCard;
