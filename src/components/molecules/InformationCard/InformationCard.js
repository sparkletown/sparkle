import React from "react";
import "./InformationCard.scss";

const InformationCard = ({ title, children }) => (
  <div className="information-card-container">
    <h4>{title}</h4>
    <p className="grey-color-text">{children}</p>
  </div>
);

export default InformationCard;
