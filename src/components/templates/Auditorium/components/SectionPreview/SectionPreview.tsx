import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faLock } from "@fortawesome/free-solid-svg-icons";

import { useVenueId } from "hooks/useVenueId";
import { useSectionSeatedUsers } from "hooks/auditoriumSections";

import UserList from "components/molecules/UserList";

import { AuditoriumSection } from "types/auditorium";

import { WithId } from "utils/id";

import "./SectionPreview.scss";

export interface SectionPreviewProps {
  section: WithId<AuditoriumSection>;
  onClick?: () => void;
}

const noop = () => {};

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  onClick,
  section,
}) => {
  const { isLocked, title } = section;

  const venueId = useVenueId();

  const seatedUsers = useSectionSeatedUsers(venueId, section.id);
  const seatedUsersNumber = seatedUsers.length;

  const containerClasses = classNames("section-preview", {
    "section-preview--locked": isLocked,
    "section-preview--empty": seatedUsersNumber === 0,
  });
  return (
    <div onClick={isLocked ? noop : onClick} className={containerClasses}>
      {isLocked && (
        <div className="section-preview__status-icons">
          {isLocked && (
            <FontAwesomeIcon
              icon={faLock}
              size="sm"
              className="section-preview__status-icons__lock"
            />
          )}
        </div>
      )}
      <div className="section-preview__title">{title ?? "Empty section"}</div>
      <div className="section-preview__people-count">
        <FontAwesomeIcon icon={faUserFriends} size="sm" />
        <span className="section-preview__people-count__number">
          {seatedUsersNumber}
        </span>
      </div>
      <UserList users={seatedUsers} hasTitle={false} />
    </div>
  );
};
