import React, { useRef, useState } from "react";
import { User } from "types/User";
import { Dropdown, FormControl } from "react-bootstrap";
import { debounce } from "lodash";
import "./PrivateRecipientSearchInput.scss";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";

interface PropsType {
  setSelectedUser: (user: WithId<User>) => void;
}

const PrivateRecipientSearchInput: React.FunctionComponent<PropsType> = ({
  setSelectedUser,
}) => {
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const onClickOnUserInSearchInput = (user: WithId<User>) => {
    setSearchValue("");
    setSelectedUser(user);
  };

  const { userArray } = useSelector((state) => ({
    userArray: state.firestore.ordered.partygoers,
  }));

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
          placeholder="Search for partygoer..."
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
          ref={searchRef}
        />
        {searchValue && (
          <ul className="floating-dropdown">
            {userArray &&
              userArray
                .filter(
                  (u) =>
                    !u.anonMode &&
                    u.partyName
                      ?.toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .filter((u) => u.id !== undefined)
                .map((u) => (
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
                ))}
          </ul>
        )}
      </Dropdown>
    </div>
  );
};

export default PrivateRecipientSearchInput;
