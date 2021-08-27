import React, { FC } from "react";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { AnyVenue, GenericVenue } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { InfoTabContent } from "./InfoTabContent";
import { InfoTabLogo } from "./InfoTabLogo";

import "./InfoTab.scss";

interface InfoTabProps {
  venue?: AnyVenue | GenericVenue;
}

export const InfoTab: FC<InfoTabProps> = ({ venue }) => {
  const { isShown, toggle } = useShowHide();
  const iconNameOrPath = venue?.host?.icon;

  const infoTabClasses = classNames("InfoTab", {
    "InfoTab--expanded": isShown,
  });

  const chevronIconClasses = classNames("InfoTab__chevron", {
    "InfoTab__chevron--turned": isShown,
  });

  return (
    <div className={infoTabClasses} onClick={toggle}>
      <div className="InfoTab__chevronWrapper">
        <div className={chevronIconClasses}>
          <FontAwesomeIcon icon={faAngleDoubleRight} size="lg" />
        </div>
      </div>
      {!isShown ? (
        <InfoTabLogo iconNameOrPath={iconNameOrPath} isInfoTabShown={false} />
      ) : (
        <InfoTabContent venue={venue} />
      )}
    </div>
  );
};
