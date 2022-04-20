import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { Hit } from "@algolia/client-search";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { addWorldAdmins } from "api/world";

import { AlgoliaSearchIndex } from "types/algolia";
import { UserId } from "types/id";
import { UserWithLocation } from "types/User";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { Button } from "../Button";
import { Input } from "../Input";

export interface InviteAdminModalProps {
  show: boolean;
  onHide: () => void;
}

type User = Hit<
  Pick<UserWithLocation, "partyName" | "pictureUrl" | "enteredVenueIds">
>;

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  show,
  onHide,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { worldId } = useWorldAndSpaceByParams();

  const defaultValues = useMemo(
    () => ({
      userName: "",
    }),
    []
  );

  const { register, watch, setValue } = useForm({
    reValidateMode: "onChange",
    defaultValues,
  });

  const searchQuery = watch("userName");

  const { value: algoliaValue } = useAlgoliaSearch(searchQuery);

  const foundUsers = algoliaValue?.[AlgoliaSearchIndex.USERS].hits;

  const [{ loading: isAddingAdmins }, addNewAdmins] = useAsyncFn(async () => {
    if (!worldId) {
      return;
    }

    const userIds = selectedUsers.map((user) => user.objectID) as UserId[];

    await addWorldAdmins(worldId, userIds);
    onHide();
  }, [onHide, selectedUsers, worldId]);

  const selectUser = (user: User) => {
    setSelectedUsers((selectedUsers) => {
      const newUsers = selectedUsers.filter(
        (selectedUser) => selectedUser !== user
      );

      return selectedUsers.includes(user) ? newUsers : [...selectedUsers, user];
    });
    setValue("userName", "");
  };

  const checkAdminAccess = (user: User) =>
    selectedUsers.find(
      (selectedUser) => selectedUser.objectID === user.objectID
    );

  const hasFoundUsers = !!foundUsers?.length;
  const hasSelectedUsers = !!selectedUsers?.length;

  return (
    <Modal show={show} onHide={onHide} autoHide>
      <div className="text-xl font-medium text-gray-900">Invite admin</div>

      {!hasFoundUsers && searchQuery && (
        <div className="flex justify-center">No users found</div>
      )}

      <div className="mt-4">Enter user name</div>
      <Input placeholder="Type user name" name="userName" register={register} />

      <div className="max-h-40 overflow-auto">
        {foundUsers?.map((user) => {
          const isSelected = checkAdminAccess(user);

          const foundUserClasses = classNames(
            "flex flex-row py-4 px-2 border-y hover:bg-gray-200 cursor-pointer",
            {
              "bg-blue-100 hover:bg-blue-200 cursor-not-allowed": isSelected,
            }
          );

          const selectedClasses = classNames(
            "px-2 flex self-center flex-end ml-1 self-center text-center align-center justify-center items-center cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100",
            {
              "cursor-not-allowed": isSelected,
            }
          );

          return (
            <div
              key={user.objectID}
              className={foundUserClasses}
              onClick={() => (!isSelected ? selectUser(user) : null)}
            >
              <img
                className="h-10 w-10 rounded-full"
                src={user.pictureUrl}
                alt="profileUrl"
              />
              <div className="px-2 flex self-center">{user.partyName}</div>
              {isSelected && (
                <div className={selectedClasses}>Already added</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 max-h-40 overflow-auto">
        {selectedUsers.map((user) => (
          <div
            key={user.objectID}
            className={
              "px-2 cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800"
            }
            onClick={() => selectUser(user)}
          >
            <img
              className="h-10 w-10 rounded-full"
              src={user.pictureUrl}
              alt="profileUrl"
            />
            <div className="px-2 flex self-center">{user.partyName}</div>
            <div className="ml-1 w-4 h-4 self-center text-center align-center justify-center items-center cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100">
              <FontAwesomeIcon icon={faClose} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={!hasSelectedUsers || isAddingAdmins}
          loading={isAddingAdmins}
          variant="danger"
          onClick={addNewAdmins}
        >
          {isAddingAdmins ? "Adding..." : "Add"}
        </Button>
      </div>
    </Modal>
  );
};
