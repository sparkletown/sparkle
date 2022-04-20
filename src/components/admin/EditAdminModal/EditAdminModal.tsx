import { useState } from "react";
import { useAsyncFn } from "react-use";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { addSpaceOwnerBulk } from "api/admin";

import { SpaceId, SpaceWithId, UserWithId } from "types/id";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { Button } from "../Button";

interface EditAdminModalProps {
  show: boolean;
  user: UserWithId;
  worldSpaces: SpaceWithId[];
  onHide: () => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  show,
  user,
  worldSpaces,
  onHide,
}) => {
  const ownedSpaces = worldSpaces.filter((space) =>
    space.owners?.includes(user.id)
  );

  const [selectedSpaces, setSelectedSpaces] = useState<SpaceWithId[]>(
    ownedSpaces
  );
  const [addedSpacesIds, setAddedSpacesIds] = useState<SpaceId[]>([]);
  const [removedSpacesIds, setRemovedSpacesIds] = useState<SpaceId[]>([]);

  const { worldId } = useWorldAndSpaceByParams();

  const hasSelectedSpaces = !!selectedSpaces.length;

  const remainingSpaces = worldSpaces.filter(
    (space) => !selectedSpaces.includes(space)
  );

  const hasRemainingSpaces = !!remainingSpaces.length;

  const [{ loading: isEditing }, editAdminSpaces] = useAsyncFn(async () => {
    if (!worldId) {
      return;
    }

    await addSpaceOwnerBulk(addedSpacesIds, removedSpacesIds, user.id, worldId);
    onHide();
  }, [addedSpacesIds, onHide, removedSpacesIds, user.id, worldId]);

  const addOwner = (space: SpaceWithId) => {
    setAddedSpacesIds((spaceIds) => [...spaceIds, space.id]);
    setSelectedSpaces((spaces) => [...spaces, space]);
  };

  const removeOwner = (space: SpaceWithId) => {
    setRemovedSpacesIds((spaceIds) => [...spaceIds, space.id]);
    setSelectedSpaces((spaces) =>
      spaces.filter((selectedSpaces) => selectedSpaces !== space)
    );
  };

  return (
    <Modal show={show} onHide={onHide} autoHide>
      <div className="text-xl font-medium text-gray-900">
        Manage user spaces
      </div>
      <div>
        <div className="mt-4 text-md font-medium text-gray-900">
          Can not edit spaces
        </div>
        <div className="text-sm text-gray-500">
          These are the spaces the user can not edit.
        </div>
        <div className="text-sm text-gray-500">
          Click to add the user as an editor.
        </div>
      </div>
      <div>
        {hasRemainingSpaces &&
          remainingSpaces.map((space) => (
            <div
              key={space.id}
              className="px-2 cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              onClick={() => addOwner(space)}
            >
              {space.name}{" "}
              <div className="ml-1 w-4 h-4 self-center text-center align-center justify-center items-center cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                <FontAwesomeIcon icon={faAdd} />
              </div>
            </div>
          ))}
        {!hasRemainingSpaces && (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            None
          </div>
        )}
      </div>
      <div>
        <div className="mt-4 text-md font-medium text-gray-900">
          Can edit spaces
        </div>
        <div className="text-sm text-gray-500">
          These are the spaces the user can edit.
        </div>
        <div className="text-sm text-gray-500">
          Click to remove the user as an editor.
        </div>
      </div>
      <div>
        {hasSelectedSpaces &&
          selectedSpaces.map((space) => (
            <div
              key={space.id}
              className="px-2 cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              onClick={() => removeOwner(space)}
            >
              {space.name}{" "}
              <div className="ml-1 w-4 h-4 self-center text-center align-center justify-center items-center cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100">
                <FontAwesomeIcon icon={faClose} />
              </div>
            </div>
          ))}
        {!hasSelectedSpaces && (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            None
          </div>
        )}
      </div>

      <div className="flex flex-row">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={isEditing}
          loading={isEditing}
          variant="danger"
          onClick={editAdminSpaces}
        >
          {isEditing ? "Editing..." : "Edit"}
        </Button>
      </div>
    </Modal>
  );
};
