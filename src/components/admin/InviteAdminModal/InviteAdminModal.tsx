import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import { addWorldAdmins } from "api/world";

import { AlgoliaSearchIndex } from "types/algolia";
import { UserId } from "types/id";
import { AlgoliaUser } from "types/User";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { Button } from "../Button";
import { Input } from "../Input";

import { FoundUserCard } from "./FoundUserCard";
import { SelectedUserCard } from "./SelectedUserCard";

export interface InviteAdminModalProps {
  show: boolean;
  onHide: () => void;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  show,
  onHide,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<AlgoliaUser[]>([]);
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

  const { value: algoliaValue, loading: isSearching } = useAlgoliaSearch(
    searchQuery
  );

  const foundUsers = algoliaValue?.[AlgoliaSearchIndex.USERS].hits;

  const [{ loading: isAddingAdmins }, addNewAdmins] = useAsyncFn(async () => {
    if (!worldId) {
      return;
    }

    const userIds = selectedUsers.map((user) => user.objectID) as UserId[];

    await addWorldAdmins(worldId, userIds);
    onHide();
  }, [onHide, selectedUsers, worldId]);

  const selectUser = (user: AlgoliaUser) => {
    setSelectedUsers((selectedUsers) => {
      const newUsers = selectedUsers.filter(
        (selectedUser) => selectedUser !== user
      );

      return selectedUsers.includes(user) ? newUsers : [...selectedUsers, user];
    });
    setValue("userName", "");
  };

  const isUserSelected = (user: AlgoliaUser) =>
    selectedUsers.find(
      (selectedUser) => selectedUser.objectID === user.objectID
    );

  const hasFoundUsers = !!foundUsers?.length;
  const hasSelectedUsers = !!selectedUsers?.length;

  return (
    <Modal show={show} onHide={onHide} autoHide>
      <div className="text-xl font-medium text-gray-900">Add owner</div>

      <div className="mt-4">Enter user name</div>
      <Input placeholder="Type user name" name="userName" register={register} />

      <div className="max-h-40 overflow-auto">
        {foundUsers?.map((user) => {
          const isSelected = !!isUserSelected(user);

          return (
            <FoundUserCard
              key={user.objectID}
              user={user}
              isSelected={isSelected}
              onCardClick={() =>
                !isSelected ? selectUser(user) : ALWAYS_NOOP_FUNCTION
              }
            />
          );
        })}
      </div>

      {!hasFoundUsers && !isSearching && searchQuery && (
        <div className="flex justify-center">No users found</div>
      )}

      {!hasFoundUsers && isSearching && searchQuery && (
        <div className="flex justify-center">Searching...</div>
      )}

      <div className="mt-4 max-h-40 overflow-auto">
        {selectedUsers.map((user) => (
          <SelectedUserCard
            key={user.objectID}
            user={user}
            onCardClick={() => selectUser(user)}
          />
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
