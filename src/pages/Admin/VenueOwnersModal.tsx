import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormControl, Modal } from "react-bootstrap";
import { useFirestore } from "react-redux-firebase";
import { debounce } from "lodash";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { addVenueOwner, removeVenueOwner } from "api/admin";

import { User } from "types/User";
import { AnyVenue, Venue_v2 } from "types/venues";

import { WithId } from "utils/id";

import "./VenueOwnerModal.scss";

interface PartitionedOwnersOthers {
  owners: WithId<User>[];
  others: WithId<User>[];
}
const makePartitionOwnersFromOthersReducer = (ownerIds: string[]) => (
  { owners, others }: PartitionedOwnersOthers,
  user: WithId<User>
) => {
  if (ownerIds.includes(user.id)) {
    return { owners: [...owners, user], others };
  } else {
    return { owners, others: [...others, user] };
  }
};

const emptyPartition: PartitionedOwnersOthers = {
  owners: [],
  others: [],
};

const makePartyNameFilter = (searchText: string) => (user: WithId<User>) =>
  user.partyName?.toLowerCase()?.includes(searchText.toLowerCase());

interface VenueOwnersModalProps {
  visible: boolean;
  venue: WithId<AnyVenue> | Venue_v2;
  onHide?: () => void;
}

export const VenueOwnersModal: React.FC<VenueOwnersModalProps> = ({
  visible,
  onHide,
  venue,
}) => {
  // Fetch all users the first time this component loads
  // @debt reading every user is obviously bad.
  const firestore = useFirestore();
  useEffect(() => {
    firestore
      .collection("users")
      .get()
      .then((result) =>
        result.docs.map<WithId<User>>(
          (doc) => ({ ...doc.data(), id: doc.id } as WithId<User>) // TODO: be less hacky with types here?
        )
      )
      .then(setAllUsers);
  }, [firestore]);

  const [searchText, setSearchText] = useState("");

  const debouncedSearch: typeof setSearchText = useMemo(
    () => debounce((v) => setSearchText(v), 100),
    []
  );

  const [allUsers, setAllUsers] = useState<WithId<User>[]>([]);

  const isLoading = allUsers.length === 0;

  // Make partition reducer using venue.owners
  const partitionOwnersFromOthersReducer = useMemo(
    () => makePartitionOwnersFromOthersReducer(venue.owners ?? []),
    [venue.owners]
  );

  // Partition owners from others
  const { owners: venueOwnerUsers, others: otherUsers } = useMemo(
    () => allUsers.reduce(partitionOwnersFromOthersReducer, emptyPartition),
    [allUsers, partitionOwnersFromOthersReducer]
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
  const hasResults = filteredUsers && filteredUsers.length > 0;

  if (isLoading) return <>Loading...</>;

  return (
    <Modal show={visible} onHide={onHide}>
      <Modal.Body>
        <div className="modal-container venue-owner-modal">
          <h3>Manage Owners</h3>
          <div className="row-container">
            <h4>Current Venue Owners</h4>
            {venueOwnerUsers.map((owner) => (
              <UserRow
                key={owner.id}
                user={owner}
                venueId={venue.id!}
                isOwner
              />
            ))}
          </div>
          <FormControl
            className="text-input"
            autoFocus
            placeholder="Search users..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <div className="row-container">
            {hasResults &&
              (filteredUsers ?? []).map((user) => (
                <UserRow key={user.id} user={user} venueId={venue.id!} />
              ))}
            {isEnterSearchText && (
              <div>Enter the users name in the text input above</div>
            )}
            {!isEnterSearchText && !hasResults && (
              <div>No results for your search</div>
            )}
          </div>
        </div>
      </Modal.Body>
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

  const userPicture = user.anonMode ? DEFAULT_PROFILE_IMAGE : user.pictureUrl;
  const userName = user.anonMode ? DEFAULT_PARTY_NAME : user.partyName;

  return (
    <>
      <div className="user-row">
        <div className="info-container">
          <img src={userPicture} alt="profile pic" />
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
