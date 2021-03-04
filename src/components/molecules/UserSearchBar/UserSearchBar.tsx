import React, { FC, useCallback, useEffect, useState } from "react";
import { UserSearchBarInput } from "./UserSearchBarInput";
import { useWorldUsers } from "hooks/users";
import { User } from "types/User";
import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls ";
import "./UserSearchBar.scss";

interface UserSearchBarProps {
  onSelect: (user: WithId<User>) => void;
}

const UserSearchBar: FC<UserSearchBarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WithId<User>[]>([]);

  const { worldUsers } = useWorldUsers();

  const { setUserProfile } = useProfileModalControls();

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const filteredPartygoers = worldUsers.filter((partygoer) =>
      partygoer.partyName?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredPartygoers);
  }, [worldUsers, searchQuery]);

  const numberOfSearchResults = searchResults.length;

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="user-search-links">
      <div className="user-search-icon" />
      <UserSearchBarInput value={searchQuery} onChange={setSearchQuery} />
      {!!searchQuery && (
        <div className="user-search-close-icon" onClick={clearSearchQuery} />
      )}
      {!!numberOfSearchResults && (
        <div className="user-search-results">
          <div className="user-search-result-number">
            <b>{numberOfSearchResults}</b> search results
          </div>
          {searchResults.map((user) => (
            <div
              className="row result-user"
              key={user.id}
              onClick={() => {
                onSelect(user);
                setUserProfile(user);
              }}
            >
              <div
                className="result-avatar"
                style={{
                  backgroundImage: `url(${user.pictureUrl})`,
                }}
              ></div>
              <div className="result-info">
                <div key={user.id}>{user.partyName}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
