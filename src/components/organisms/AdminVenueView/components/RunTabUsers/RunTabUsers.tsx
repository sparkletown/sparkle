import React, { useState, useMemo } from "react";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useRecentWorldUsers } from "hooks/users";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { SearchField } from "components/organisms/AdminVenueView/components/SearchField/SearchField";
import { RunTabUserInfo } from "components/organisms/AdminVenueView/components/RunTabUserInfo";

import "./RunTabUsers.scss";

interface RunTabSidebarProps {
  venueId?: string;
}

export const RunTabUsers: React.FC<RunTabSidebarProps> = ({ venueId }) => {
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const { recentWorldUsers } = useRecentWorldUsers();
  const [searchText, setSearchText] = useState("");

  const admins = useMemo(() => {
    const owners = venue?.owners ?? [];
    return recentWorldUsers.filter(({ id }) => owners.includes(id));
  }, [recentWorldUsers, venue?.owners]);

  const users = useMemo(() => {
    const needle = searchText.toLowerCase();
    return recentWorldUsers.filter(({ partyName }) =>
      partyName?.toLowerCase().includes(needle)
    );
  }, [recentWorldUsers, searchText]);

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
        <ButtonNG>Invite admin</ButtonNG>
      </div>
      {users.map((user) => (
        <RunTabUserInfo key={user.id} user={user} />
      ))}
    </div>
  );
};
