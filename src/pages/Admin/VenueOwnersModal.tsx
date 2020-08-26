import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "hooks/useSelector";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { FormControl } from "react-bootstrap";

interface VenueOwnersModalProps {
  visible: boolean;
  onHide?: () => void;
}

export const VenueOwnersModal: React.FC<VenueOwnersModalProps> = (props) => {
  const { visible, onHide } = props;

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
    () => (fuseUsers && searchText ? fuseUsers.search(searchText) : []),
    [searchText, fuseUsers]
  );

  if (!allUsers) return <>Loading...</>;

  return (
    <Modal show={visible} onHide={onHide}>
      <Modal.Body>
        <div className="modal-container">
          <FormControl
            autoFocus
            placeholder="Search users..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          {filteredUsers.map((user) => (
            <div key={user.item.id}>{user.item.partyName}</div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};
