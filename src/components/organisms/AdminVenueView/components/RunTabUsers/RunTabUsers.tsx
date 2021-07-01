import React, { useState, useMemo } from "react";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useWorldUsers, useRecentWorldUsers } from "hooks/users";

import { SearchField } from "components/organisms/AdminVenueView/components/SearchField/SearchField";
import { Avatar } from "components/organisms/AdminVenueView/components/Avatar/Avatar";
import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import "./RunTabUsers.scss";

interface RunTabSidebarProps {
  venueId?: string;
}

export const RunTabUsers: React.FC<RunTabSidebarProps> = ({ venueId }) => {
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const { worldUsers } = useWorldUsers();
  const { recentWorldUsers } = useRecentWorldUsers();
  const [searchText, setSearchText] = useState("");

  const admins = useMemo(() => {
    const owners = venue?.owners ?? [];
    return worldUsers.filter(({ id }) => owners.includes(id));
  }, [worldUsers, venue?.owners]);

  const users = useMemo(() => {
    const needle = searchText.toLowerCase();
    return worldUsers.filter(({ partyName }) =>
      partyName?.toLowerCase().includes(needle)
    );
  }, [worldUsers, searchText]);

  return (
    <div className="RunTabUsers">
      <div className="RunTabUsers__row RunTabUsers__manage">
        <span className="RunTabUsers__info">
          {recentWorldUsers.length} people live
        </span>
        <ButtonNG>Manage users</ButtonNG>
      </div>
      <div className="RunTabUsers__row RunTabUsers__search">
        <SearchField
          autoFocus
          placeholder="Search for people"
          onChange={setSearchText}
        />
      </div>
      <div className="RunTabUsers__row RunTabUsers__manage">
        <span className="RunTabUsers__info">
          {admins.length} admin{admins.length !== 1 && "s"} online
        </span>
        <ButtonNG>Manage admins</ButtonNG>
      </div>
      {users.map((user) => (
        <div key={user.id} className="RunTabUsers__row RunTabUsers__user">
          <Avatar user={user} size={32} />
          <div className="RunTabUsers__wrapper">
            <div className="RunTabUsers__name">{user.partyName}</div>
            <div className="RunTabUsers__place">
              in {user.enteredVenueIds?.[0]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
