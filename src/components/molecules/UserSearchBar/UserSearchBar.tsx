import UserProfileModal from "components/organisms/UserProfileModal";
import React, { FC, useCallback, useEffect, useState } from "react";
import { UserSearchBarInput } from "./UserSearchBarInput";
import { useWorldUsers } from "hooks/users";
import { User } from "types/User";
import { WithId } from "utils/id";

import { setUserProfileModalVisibility } from "store/actions/UserProfile";
import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import "./UserSearchBar.scss";
import { userProfileModalVisibilitySelector } from "utils/selectors";

interface UserSearchBarProps {
  onSelect: (user: WithId<User>) => void;
}

const UserSearchBar: FC<UserSearchBarProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WithId<User>[]>([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const { worldUsers } = useWorldUsers();

  const dispatch = useDispatch();
  const isUserProfileModalVisible = useSelector(
    userProfileModalVisibilitySelector
  );

  const setUserProfileModalVisible = useCallback(() => {
    if (isUserProfileModalVisible) {
      setSelectedUserProfile(undefined);
    }
    dispatch(setUserProfileModalVisibility(!isUserProfileModalVisible));
  }, [dispatch, isUserProfileModalVisible]);

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
                setUserProfileModalVisible();
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
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={isUserProfileModalVisible}
        onHide={setUserProfileModalVisible}
      />
    </div>
  );
};
export default UserSearchBar;
