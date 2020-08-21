import React from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";

const SparkleFairiesPopUp = () => {
  return (
    <InformationLeftColumn venueLogoPath={"ambulance"}>
      <InformationCard title="Call the Sparkle Fairies">
        <p className="title-sidebar">{`It's ok to need help!`}</p>
        <p className="short-description-sidebar">
          {`Sparkle Fairies (also knows as "reality rangers") are here to help if you need us. Whether you're feeling down, need a hug, have an issue with someone at the burn or taken too much of something, we're here to help.`}
        </p>
        <p>{`We're discreet, loving and here for you!`}</p>
        <a
          href="https://www.theguardian.com"
          rel="noopener noreferrer"
          target="_blank"
          className="link-button"
        >
          Go to private zoom
        </a>
      </InformationCard>
    </InformationLeftColumn>
  );
};

export default SparkleFairiesPopUp;
