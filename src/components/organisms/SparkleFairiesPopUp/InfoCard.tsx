import React from "react";
import "./InfoCard.scss";

const InformationCard: React.FunctionComponent = () => (
  <div className={`info-card-container`}>
    <p className="info-card-title">Call the Sparkle Fairies</p>
    <p className="info-card-text">{"It's ok to need help!"}</p>
    <p className="info-card-text">
      {`Sparkle Fairies (also knows as "reality rangers") are here to help if you need us. Whether you're feeling down, need a hug, have an issue with someone at the burn or taken too much of something, we're here to help.`}
    </p>
    <p className="info-card-text">
      {`We're discreet, loving and here for you!`}
    </p>
    <a
      href="https://www.theguardian.com"
      rel="noopener noreferrer"
      target="_blank"
      className="link-button"
    >
      Go to private zoom
    </a>
  </div>
);

export default InformationCard;
