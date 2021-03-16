import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faBan,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import { AuditoriumSection } from "types/auditorium";

import "./SectionPreview.scss";

export interface SectionPreviewProps {
  onClick?: () => void;
  section: AuditoriumSection;
}

const noop = () => {};

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  onClick,
  section,
}) => {
  const { isLocked } = section;
  const isFull = Math.random() <= 0.2;

  const isUnavailable = isFull || isLocked;

  const containerClasses = classNames("section-preview", {
    "section-preview--full": isFull,
    "section-preview--locked": isLocked,
  });
  return (
    <div onClick={isUnavailable ? noop : onClick} className={containerClasses}>
      {isUnavailable && (
        <div className="section-preview__status-icons">
          {isFull && <FontAwesomeIcon icon={faBan} size="sm" />}
          {isLocked && (
            <FontAwesomeIcon
              icon={faLock}
              size="sm"
              className="section-preview__status-icons__lock"
            />
          )}
        </div>
      )}
      <div className="section-preview__people-count">
        <FontAwesomeIcon icon={faUserFriends} size="sm" />
        <span className="section-preview__people-count__number">
          {Math.ceil(Math.random() * 100)}
        </span>
      </div>
      <div className="section-preview__people-icons"></div>
    </div>
  );
};
