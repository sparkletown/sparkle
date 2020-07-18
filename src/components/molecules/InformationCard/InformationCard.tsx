import React from "react";
import "./InformationCard.scss";

interface PropsType {
  title: string;
  children: React.ReactNode;
  className?: string;
  url?: string;
}

const InformationCard: React.FunctionComponent<PropsType> = ({
  title,
  children,
  className,
  url,
}) => {
  if (url) {
    return (
      <a
        className={`information-card-container ${className}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h4>{title}</h4>
        <p className="information-card-text">{children}</p>
      </a>
    );
  }

  return (
    <div className={`information-card-container ${className}`}>
      <h4>{title}</h4>
      <p className="information-card-text">{children}</p>
    </div>
  );
};

export default InformationCard;
