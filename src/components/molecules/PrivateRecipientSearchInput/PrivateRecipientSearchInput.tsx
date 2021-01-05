import React, { useRef, useState, useMemo, useCallback } from "react";
import { User } from "types/User";
import { Dropdown, FormControl } from "react-bootstrap";
import { debounce } from "lodash";
import { usePartygoers } from "hooks/users";
import { WithId } from "utils/id";

import "./PrivateRecipientSearchInput.scss";

interface PropsType {
  setSelectedUser: (user: WithId<User>) => void;
}

const PrivateRecipientSearchInput: React.FunctionComponent<PropsType> = ({
  setSelectedUser,
}) => {
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const onClickOnUserInSearchInput = useCallback(
    (user: WithId<User>) => {
      setSearchValue("");
      setSelectedUser(user);
    },
    [setSelectedUser]
  );

  const partygoers = usePartygoers();

  const privateRecipients = useMemo(
    () =>
      partygoers
        .filter(
          (u) =>
            !u.anonMode &&
            u.partyName?.toLowerCase().includes(searchValue.toLowerCase())
        )
        .filter((u) => u.id !== undefined),
    [partygoers, searchValue]
  );

  const dropdownOptions = useMemo(
    () =>
      privateRecipients.map((u) => (
        <Dropdown.Item
          onClick={() => onClickOnUserInSearchInput(u)}
          id="private-chat-dropdown-private-recipient"
          className="private-recipient"
          key={u.id}
        >
          <img
            src={u.pictureUrl}
            className="picture-logo"
            alt={u.partyName}
            width="20"
            height="20"
          />
          {u.partyName}
        </Dropdown.Item>
      )),
    [privateRecipients, onClickOnUserInSearchInput]
  );

  return (
    <div className="private-recipient-search-input-container">
      <Dropdown
        onToggle={(isOpen: boolean) => {
          if (!isOpen) {
            setSearchValue("");
            if (searchRef?.current) {
              searchRef.current.value = "";
            }
          }
        }}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Search for attendee..."
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
          ref={searchRef}
        />
        {searchValue && (
          <ul className="floating-dropdown">{dropdownOptions}</ul>
        )}
      </Dropdown>
    </div>
  );
};

export default PrivateRecipientSearchInput;
