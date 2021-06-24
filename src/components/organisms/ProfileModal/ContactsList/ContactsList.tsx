import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import Button from "components/atoms/Button";

import { UserProfileMode } from "../ProfilePopoverContent";

import "./ContactsList.scss";

export interface ContactsListProps {
  user?: WithId<User>;
  setUserProfileMode: (mode: UserProfileMode) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  setUserProfileMode,
}) => {
  return (
    <div className="ContactsList">
      <div className="ContactsList__title">My Contacts</div>
      <div className="ContactsList__users"></div>
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
