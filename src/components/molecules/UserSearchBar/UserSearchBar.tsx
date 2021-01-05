import UserProfileModal from "components/organisms/UserProfileModal";
import React, { FC, useCallback, useEffect, useState } from "react";
import { UserSearchBarInput } from "./UserSearchBarInput";
import { usePartygoers } from "hooks/users";
import { User } from "types/User";
import { WithId } from "utils/id";

import "./UserSearchBar.scss";

interface UserSearchBarProps {
  onSelect: (user: WithId<User>) => void;
}

const UserSearchBar: FC<UserSearchBarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WithId<User>[]>([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const partygoers = usePartygoers();

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const filteredPartygoers = partygoers.filter((partygoer) =>
      partygoer.partyName?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredPartygoers);
  }, [partygoers, searchQuery]);

  const numberOfSearchResults = searchResults.length;

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearSelectedUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

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
              onClick={() => onSelect(user)}
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
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={!!selectedUserProfile}
        onHide={clearSelectedUserProfile}
      />
    </div>
  );
};

export default UserSearchBar;
