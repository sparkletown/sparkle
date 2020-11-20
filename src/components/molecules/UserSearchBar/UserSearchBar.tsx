import UserProfileModal from "components/organisms/UserProfileModal";
import { useSelector } from "hooks/useSelector";
import React, { FC, useCallback, useEffect, useState } from "react";
import { UserSearchBarInput } from "./UserSearchBarInput";
import { User } from "types/User";
import {
  currentVenueSelectorData,
  partygoersSelector,
  venueEventsSelector,
} from "utils/selectors";
import "./UserSearchBar.scss";
import { WithId } from "utils/id";

interface UserSearchBarProps {
  onSelect: (user: WithId<User>) => void;
}

const UserSearchBar: FC<UserSearchBarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WithId<User>[]>([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  const venue = useSelector(currentVenueSelectorData);
  const partygoers = useSelector(partygoersSelector);
  const venueEvents = useSelector(venueEventsSelector);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);
      return;
    }
    const filteredPartygoers = partygoers
      ? Object.values(partygoers).filter((partygoer) =>
          partygoer.partyName
            ?.toLowerCase()
            ?.includes(searchQuery.toLowerCase())
        )
      : [];
    setSearchResult(filteredPartygoers);
  }, [partygoers, searchQuery, venue, venueEvents]);

  const numberOfSearchResults = searchResult.length;

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
        <>
          <div className="user-search-results">
            <div className="user-search-result-number">
              <b>{numberOfSearchResults}</b> search results
            </div>
            {searchResult.map((user, index) => {
              return (
                <div
                  className="row"
                  key={`room-${index}`}
                  onClick={() => onSelect(user)}
                >
                  <div
                    className="result-avatar"
                    style={{
                      backgroundImage: `url(${user.pictureUrl})`,
                    }}
                  ></div>
                  <div className="result-info">
                    <div key={`user-${index}`}>{user.partyName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </div>
  );
};

export default UserSearchBar;
