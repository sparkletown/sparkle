import React, { useState } from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";
import "./DonatePopUp.scss";

export const DonatePopUp = () => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <InformationLeftColumn
      venueLogoPath={"heart"}
      isLeftColumnExpanded={isLeftColumnExpanded}
      setIsLeftColumnExpanded={setIsLeftColumnExpanded}
    >
      <InformationCard title="Donate to Burning Man">
        <p
          className="title-sidebar"
          style={{ fontSize: 15 }}
        >{`We need your support to make this event better!`}</p>
        <div className="donate-container">
          <a
            className="btn btn-primary join-button"
            style={{ fontSize: 16 }}
            href={`https://donate.burningman.org/?utm_source=sparkleverse&utm_medium=donate&utm_campaign=multiverse`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Make a donation
          </a>
          <br />
          <button
            className="not-yet-button"
            onClick={() => setIsLeftColumnExpanded((prev) => !prev)}
          >
            Not yet
          </button>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};
