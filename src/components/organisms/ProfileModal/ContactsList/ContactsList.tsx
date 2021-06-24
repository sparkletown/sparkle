import React, { useMemo, useCallback } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useContactsListToDisplay } from "hooks/users";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import Button from "components/atoms/Button";
import { UserAvatar } from "components/atoms/UserAvatar";

import { UserProfileMode } from "../ProfilePopoverContent";

import "./ContactsList.scss";

export interface ContactsListProps {
  user?: WithId<User>;
  setUserProfileMode: (mode: UserProfileMode) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  setUserProfileMode,
}) => {
  const contactsList = useContactsListToDisplay();
  const { openUserProfileModal } = useProfileModalControls();

  const openAuthorProfile = useCallback(
    (user) => {
      openUserProfileModal(user);
    },
    [openUserProfileModal]
  );

  const renderList = useMemo(
    () =>
      contactsList.map((user) => (
        <div
          key={user.id}
          className="ContactsList__user"
          onClick={() => openAuthorProfile(user)}
        >
          <UserAvatar
            user={user}
            showStatus
            containerClassName="ContactsList__user--avatar"
          />
          <span className="ContactsList__user--name">{user.partyName}</span>
        </div>
      )),
    [openAuthorProfile, contactsList]
  );

  return (
    <div className="ContactsList">
      <div className="ContactsList__title">My Contacts</div>
      <div className="ContactsList__users">{renderList}</div>
      <Button
        customClass="ContactsList__button--cancel"
        onClick={() => setUserProfileMode(UserProfileMode.DEFAULT)}
        type="reset"
      >
        Back
      </Button>
    </div>
  );
};
