import React from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TabNavigationProps } from "components/organisms/AdminVenueView/AdminVenueView";

import "./TabFooter.scss";

export const TabFooter: React.FC<TabNavigationProps> = ({
  onClickHome,
  onClickBack,
  onClickNext,
}) => {
  return (
    <div className="TabFooter">
      <div className="TabFooter__home-button" onClick={onClickHome}>
        <FontAwesomeIcon icon={faHome} size={"lg"} />
      </div>
      <div className="TabFooter__nav-buttons">
        <div className={"TabFooter__back-button"} onClick={onClickBack}>
          Back
        </div>
        <div className="TabFooter__next-button" onClick={onClickNext}>
          Next
        </div>
      </div>
    </div>
  );
};
