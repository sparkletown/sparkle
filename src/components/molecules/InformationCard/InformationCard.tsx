import React from "react";
import "./InformationCard.scss";

interface PropsType {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InformationCard: React.FunctionComponent<PropsType> = ({
  title,
  children,
  className,
}) => (
  <div className={`information-card-container ${className}`}>
    <h4>{title}</h4>
    <div className="information-card-text">{children}</div>
  </div>
);

export default InformationCard;
