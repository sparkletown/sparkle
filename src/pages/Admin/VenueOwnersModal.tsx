import React, { useMemo, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "hooks/useSelector";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { FormControl } from "react-bootstrap";
import { User } from "types/User";
import "./VenueOwnerModal.scss";
import { AnyVenue } from "types/Firestore";
import { WithId } from "utils/id";
import { addVenueOwner, removeVenueOwner } from "api/admin";

interface VenueOwnersModalProps {
  visible: boolean;
  venue: WithId<AnyVenue>;
  onHide?: () => void;
}

export const VenueOwnersModal: React.FC<VenueOwnersModalProps> = (props) => {
  const { visible, onHide, venue } = props;

  // @debt reading every user into redux is obviously bad.
  // A better solution is to create an index on partyName and a firebase function to search
  useFirestoreConnect({
    collection: "users",
    storeAs: "allUsers",
  });

  const allUsers = useSelector((state) => state.firestore.ordered.allUsers);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch: typeof setSearchText = debounce(
    (v) => setSearchText(v),
    500
  );

  const fuseUsers = useMemo(
    () =>
      allUsers
        ? new Fuse(allUsers, {
            keys: ["partyName"],
          })
        : undefined,
    [allUsers]
  );

  const filteredUsers = useMemo(
    () => (searchText ? fuseUsers?.search(searchText) : undefined),
    [searchText, fuseUsers]
  );

  const venueOwners = venue.owners ?? [];

  const ownerUsers = useMemo(
    () =>
      venueOwners
        .map((id) => allUsers?.find((user) => user.id === id))
        .filter(Boolean) as Exclude<typeof allUsers, undefined>,
    [venueOwners, allUsers]
  );

  if (!allUsers) return <>Loading...</>;

  return (
    <Modal show={visible} onHide={onHide}>
      <Modal.Body>
        <div className="modal-container venue-owner-modal">
          <h3>Manage Owners</h3>
          <div className="row-container">
            <h4>Current Venue Owners</h4>
            {ownerUsers.map((owner) => (
              <UserRow key={owner.id} user={owner} venueId={venue.id} isOwner />
            ))}
          </div>
          <FormControl
            className="text-input"
            autoFocus
            placeholder="Search users..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <div className="row-container">
            {typeof filteredUsers === "undefined" ? (
              <div>Enter the users name in the text input above</div>
            ) : filteredUsers.length === 0 ? (
              <div>No results for your search</div>
            ) : (
              filteredUsers
                .filter(
                  (userItem) =>
                    !venueOwners.some((id) => id === userItem.item.id)
                )
                .map((userItem) => (
                  <UserRow
                    key={userItem.item.id}
                    user={userItem.item}
                    venueId={venue.id}
                  />
                ))
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onRemoveUserClick = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    await removeVenueOwner(venueId, user.id);
    setLoading(false);
    setError("Something went wrong. Try again.");
  }, [venueId, user.id]);

  const onMakeUserClick = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    await addVenueOwner(venueId, user.id);
    setLoading(false);
    setError("Something went wrong. Try again.");
  }, [venueId, user.id]);

  return (
    <>
      <div className="user-row">
        <div className="info-container">
          <img src={user.pictureUrl} alt="profile pic" />
          {user.partyName}
        </div>
        {isOwner &&
          (loading ? (
            <div>Loading...</div>
          ) : (
            <button className="btn btn-primary" onClick={onRemoveUserClick}>
              Remove Owner
            </button>
          ))}
        {!isOwner &&
          (loading ? (
            <div>Loading...</div>
          ) : (
            <button className="btn btn-primary" onClick={onMakeUserClick}>
              Make Owner
            </button>
          ))}
      </div>
      {error && <div>{error}</div>}
    </>
  );
};
