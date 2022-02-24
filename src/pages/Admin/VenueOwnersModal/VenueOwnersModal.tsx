import React, { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";

import { DEFAULT_PARTY_NAME } from "settings";

import { addVenueOwner, removeVenueOwner } from "api/admin";

import { Users } from "types/id";
import { User } from "types/User";
import { AnyVenue, Venue_v2 } from "types/venues";

import { WithId } from "utils/id";
import { determineAvatar } from "utils/image";

import { Modal } from "components/molecules/Modal";
import { SearchField } from "components/organisms/AdminVenueView/components/SearchField/SearchField";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./VenueOwnerModal.scss";

interface PartitionedOwnersOthers {
  owners: WithId<User>[];
  others: WithId<User>[];
}

type MakePartitionOwnersFromOthersReducer = (
  ownerIds: string[]
) => (
  { owners, others }: PartitionedOwnersOthers,
  user: WithId<User>
) => {
  owners: (WithId<User> | (User & { id: string }))[];
  others: WithId<User>[];
};

const makePartitionOwnersFromOthersReducer: MakePartitionOwnersFromOthersReducer = (
  ownerIds
) => ({ owners, others }, user) => {
  if (ownerIds.includes(user.id)) {
    return { owners: [...owners, user], others };
  } else {
    return { owners, others: [...others, user] };
  }
};

const emptyPartition: () => PartitionedOwnersOthers = () => ({
  owners: [],
  others: [],
});

const makePartyNameFilter = (searchText: string) => (user: WithId<User>) =>
  user.partyName?.toLowerCase()?.includes(searchText.toLowerCase());

interface VenueOwnersModalProps {
  visible: boolean;
  venue: WithId<AnyVenue> | Venue_v2;
  onHide?: () => void;
  users: Users;
}

export const VenueOwnersModal: React.FC<VenueOwnersModalProps> = ({
  visible,
  onHide,
  venue,
  users,
}) => {
  const [searchText, setSearchText] = useState("");

  const debouncedSearch: typeof setSearchText = useMemo(
    () => debounce((v) => setSearchText(v), 100),
    []
  );

  const partitionOwnersFromOthersReducer = useMemo(
    () => makePartitionOwnersFromOthersReducer(venue.owners ?? []),
    [venue.owners]
  );

  const { owners: ownerUsers, others: otherUsers } = useMemo(
    () =>
      (users ?? []).reduce(partitionOwnersFromOthersReducer, emptyPartition()),
    [users, partitionOwnersFromOthersReducer]
  );

  // Filter others by partyName using searchText
  const filteredUsers = useMemo(
    () =>
      searchText !== ""
        ? otherUsers.filter(makePartyNameFilter(searchText))
        : undefined,
    [otherUsers, searchText]
  );

  const isEnterSearchText = filteredUsers === undefined;
  const hasResults = filteredUsers && filteredUsers?.length > 0;

  return (
    <Modal show={visible} onHide={onHide} centered bgVariant="dark">
      <div className="VenueOwnersModal">
        <h3>Manage Owners</h3>
        <div className="row-container">
          <h4>Current Venue Owners</h4>
          {ownerUsers.map((owner) => (
            <UserRow key={owner.id} user={owner} venueId={venue.id} isOwner />
          ))}
        </div>
        <div className="VenueOwnersModal__search">
          <SearchField
            autoFocus
            placeholder="Search users..."
            onChange={debouncedSearch}
          />
        </div>

        <div className="row-container">
          {hasResults &&
            (filteredUsers ?? []).map((user) => (
              <UserRow key={user.id} user={user} venueId={venue.id} />
            ))}
          {isEnterSearchText && (
            <div>Enter the users name in the text input above</div>
          )}
          {!isEnterSearchText && !hasResults && (
            <div>No results for your search</div>
          )}
        </div>
      </div>
      <img
        className="VenueOwnersModal__close-icon"
        src={PortalCloseIcon}
        alt="close event"
        onClick={onHide}
      />
    </Modal>
  );
};

interface UserRowProps {
  user: WithId<User>;
  venueId: string;
  isOwner?: boolean;
}

const UserRow: React.FC<UserRowProps> = (props) => {
  const { user, isOwner, venueId } = props;

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const removeOwner = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    await removeVenueOwner(venueId, user.id);
    setLoading(false);
    setError("Something went wrong. Try again.");
  }, [venueId, user.id]);

  const makeOwner = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    await addVenueOwner(venueId, user.id);
    setLoading(false);
    setError("Something went wrong. Try again.");
  }, [venueId, user.id]);

  const { src: userPicture, onError: onLoadError } = determineAvatar({ user });
  const userName = user.partyName || DEFAULT_PARTY_NAME;

  return (
    <>
      <div className="user-row">
        <div className="info-container">
          <img src={userPicture} alt="profile pic" onError={onLoadError} />
          {userName}
        </div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <button
            className="btn btn-primary"
            onClick={isOwner ? removeOwner : makeOwner}
          >
            {isOwner ? "Remove Owner" : "Make Owner"}
          </button>
        )}
      </div>
      {error && <div>{error}</div>}
    </>
  );
};
