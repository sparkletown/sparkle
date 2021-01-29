import React, { useRef } from "react";

import {
  BURNING_MAN_DONATION_SITE,
  BURNING_MAN_DONATION_TEXT,
  BURNING_MAN_DONATION_TITLE,
} from "settings";

import {
  InformationLeftColumn,
  InformationLeftColumnControls,
} from "components/organisms/InformationLeftColumn";

import InformationCard from "components/molecules/InformationCard";

import "./DonatePopUp.scss";

export const DonatePopUp = () => {
  const controlsRef = useRef<InformationLeftColumnControls>(null);

  const { toggleExpanded } = controlsRef.current ?? {};

  return (
    <InformationLeftColumn ref={controlsRef} iconNameOrPath="heart">
      <InformationCard title={BURNING_MAN_DONATION_TITLE}>
        <p className="title-sidebar" style={{ fontSize: 15 }}>
          {BURNING_MAN_DONATION_TEXT}
        </p>

        <div className="donate-container">
          <a
            className="btn btn-primary join-button"
            style={{ fontSize: 16 }}
            href={BURNING_MAN_DONATION_SITE}
            target="_blank"
            rel="noopener noreferrer"
          >
            Make a donation
          </a>

          <br />

          <button className="not-yet-button" onClick={toggleExpanded}>
            Not yet
          </button>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};
