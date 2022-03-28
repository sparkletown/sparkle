import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SpaceWithId, UserId, UserWithId } from "types/id";

import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button";
import { DeleteAdminModal } from "../DeleteAdminModal";
import { EditAdminModal } from "../EditAdminModal";

export interface WorldUserCardProps {
  user: UserWithId;
  spaces: SpaceWithId[];
  worldSpaces: SpaceWithId[];
  userId?: UserId;
}

export const WorldUserCard: React.FC<WorldUserCardProps> = ({
  user,
  spaces,
  userId,
  worldSpaces,
}) => {
  const ownedSpaces = spaces.filter((space) =>
    space.owners?.includes(user.id as string)
  );

  const isMyUserCard = user.id === userId;

  const {
    isShown: isShownDeleteAdminModal,
    show: showDeleteAdminModal,
    hide: hideDeleteAdminModal,
  } = useShowHide();

  const {
    isShown: isShownEditAdminModal,
    show: showEditAdminModal,
    hide: hideEditAdminModal,
  } = useShowHide();

  const showDeleteModal = () => {
    if (isMyUserCard) {
      return;
    }

    showDeleteAdminModal();
  };

  return (
    <div className="px-6 py-4 w-full flex flex-row gap-x-4 items-center ">
      <div className=" whitespace-nowrap flex flex-row w-full">
        <img
          className="h-10 w-10 rounded-full"
          src={user?.pictureUrl}
          alt="profileUrl"
        />
        <div className="flex items-center ml-4">
          <div className="text-sm font-medium text-gray-900 hover:text-sparkle-darker">
            {user?.partyName}
          </div>
        </div>
      </div>
      <div className="w-full whitespace-nowrap text-sm text-gray-500">
        Owner
      </div>
      <div className="w-full">
        {ownedSpaces.map((space) => (
          <div
            key={space.id}
            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
          >
            {space.name}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-full justify-end">
        <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-x-5">
          <Button
            variant="secondary"
            borders="none"
            onClick={showEditAdminModal}
          >
            <FontAwesomeIcon icon={faPen} className="px-1" size="lg" />

            <div>Edit</div>
          </Button>
        </div>
        <div className="whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-x-5">
          <Button
            variant="secondary"
            borders="none"
            disabled={isMyUserCard}
            onClick={showDeleteModal}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="px-1 text-warning-red"
              size="lg"
            />
            <div className="text-warning-red">Delete</div>
          </Button>
        </div>
      </div>
      {isShownDeleteAdminModal && (
        <DeleteAdminModal
          show={isShownDeleteAdminModal}
          user={user}
          onHide={hideDeleteAdminModal}
        />
      )}
      {isShownEditAdminModal && (
        <EditAdminModal
          show={isShownEditAdminModal}
          user={user}
          worldSpaces={worldSpaces}
          onHide={hideEditAdminModal}
        />
      )}
    </div>
  );
};
