import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { Banner } from "types/banner";

import { isDefined } from "utils/types";

import { getStatusIcon, getStatusText } from "./statusHelpers";

import "./AnnouncementStatus.scss";

export interface AnnouncementStatusProps {
  banner?: Banner;
}

export const AnnouncementStatus: React.FC<AnnouncementStatusProps> = ({
  banner,
}) => {
  const urlText = banner?.isActionButton ? banner?.buttonUrl : "blank";

  const urlTextClasses = classNames("AnnouncementStatus__url-text", {
    "AnnouncementStatus__url-text--empty": !banner?.isActionButton,
  });

  if (!isDefined(banner?.content)) return null;

  return (
    <div className="AnnouncementStatus">
      <div className="AnnouncementStatus__buttons">
        <span className="AnnouncementStatus__checkbox">
          <FontAwesomeIcon
            icon={getStatusIcon(banner?.isFullScreen)}
            className="AnnouncementStatus__img"
          />
          Fullscreen {getStatusText(banner?.isFullScreen)}
        </span>

        <span className="AnnouncementStatus__checkbox">
          <FontAwesomeIcon
            icon={getStatusIcon(banner?.isForceFunnel)}
            className="AnnouncementStatus__img"
          />
          Force funnel {getStatusText(banner?.isForceFunnel)}
        </span>
      </div>

      <div className="AnnouncementStatus__url">
        URL:{" "}
        <a className={urlTextClasses} href={urlText}>
          {urlText}
        </a>
      </div>
    </div>
  );
};
