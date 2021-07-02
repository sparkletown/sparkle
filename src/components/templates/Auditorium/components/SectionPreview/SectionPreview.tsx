import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

import { AuditoriumVenue } from "types/venues";
import { AuditoriumSection } from "types/auditorium";

import { WithId } from "utils/id";

import { useSectionSeatedUsers } from "hooks/auditoriumSections";

import { UserList } from "components/molecules/UserList";

import { getSectionCapacity } from "../../utils";

import "./SectionPreview.scss";

export interface SectionPreviewProps {
  section: WithId<AuditoriumSection>;
  venue: WithId<AuditoriumVenue>;
}

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  section,
  venue,
}) => {
  const history = useHistory();

  const maxUsers = getSectionCapacity(venue, section);

  const seatedUsers = useSectionSeatedUsers(venue.id, section.id);
  const seatedUsersCount = seatedUsers.length;

  const isFull = seatedUsersCount >= maxUsers;
  const isEmpty = seatedUsersCount === 0;

  const userAmountText = `${seatedUsersCount}/${maxUsers}`;

  const handleClick = () => {
    if (isFull) {
      // TODO: Show fancy modal, explainig why a person can't access the preveiw
      return;
    }

    history.push(`${history.location.pathname}/section/${section.id}`);
  };

  const containerClasses = classNames("SectionPreview", {
    "SectionPreview--full": isFull,
    "SectionPreview--empty": isEmpty,
    "SectionPreview--vip": section.isVip,
  });

  return (
    <div className={containerClasses} onClick={handleClick}>
      {section.isVip && <div className="SectionPreview__vip-label">VIP</div>}

      <div className="SectionPreview__people-count">
        <FontAwesomeIcon icon={faUserFriends} size="sm" />
        <span className="SectionPreview__people-count-number">
          {userAmountText}
        </span>
      </div>

      <UserList
        users={seatedUsers}
        showTitle={false}
        limit={11}
        showMoreUsersToggler={false}
        hasClickableAvatars={false}
        cellClassName="SectionPreview__avatar"
      />
    </div>
  );
};
