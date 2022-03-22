import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { Hit } from "@algolia/client-search";
import classNames from "classnames";

import { addWorldAdmins } from "api/world";

import { AlgoliaSearchIndex } from "types/algolia";
import { UserId } from "types/id";
import { UserWithLocation } from "types/User";

import { pluralize } from "utils/string";

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
  Pick<
    UserWithLocation,
    "partyName" | "pictureUrl" | "anonMode" | "enteredVenueIds"
  >
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

  const { register, watch } = useForm({
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
  });

  const selectUser = (user: User) => {
    setSelectedUsers((selectedUsers) => {
      const newUsers = selectedUsers.filter(
        (selectedUser) => selectedUser !== user
      );

      return selectedUsers.includes(user) ? newUsers : [...selectedUsers, user];
    });
  };

  const checkAdminAccess = (user: User) => selectedUsers.includes(user);

  const hasFoundUsers = !!foundUsers?.length;
  const hasSelectedUsers = selectedUsers?.length;

  const pluralizedUser = pluralize<User>("user", foundUsers);

  return (
    <Modal show={show} onHide={onHide} autoHide>
      {hasFoundUsers && (
        <div className="flex justify-center">{`${foundUsers.length} ${pluralizedUser} found`}</div>
      )}

      {!hasFoundUsers && searchQuery && (
        <div className="flex justify-center">No users found</div>
      )}

      <Input placeholder="Type user name" name="userName" register={register} />

      <div className="max-h-40 overflow-auto">
        {foundUsers?.map((user) => {
          const foundUserClasses = classNames(
            "flex flex-row py-4 px-2 border-y hover:bg-gray-200 cursor-pointer",
            {
              "bg-blue-100 hover:bg-blue-200": checkAdminAccess(user),
            }
          );

          return (
            <div
              key={user.objectID}
              className={foundUserClasses}
              onClick={() => selectUser(user)}
            >
              <img
                className="h-10 w-10 rounded-full"
                src={user.pictureUrl}
                alt="profileUrl"
              />
              <div className="px-2 flex self-center">{user.partyName}</div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={!hasSelectedUsers || isAddingAdmins}
          variant="danger"
          onClick={addNewAdmins}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};
