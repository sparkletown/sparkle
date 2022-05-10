import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DEFAULT_AVATAR } from "settings";

import { UserId, UserWithId } from "types/id";

import { useValidImage } from "hooks/image/useValidImage";
import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button";
import { DeleteAdminModal } from "../DeleteAdminModal";

export interface WorldUserCardProps {
  user: UserWithId;
  userId?: UserId;
}

export const WorldUserCard: React.FC<WorldUserCardProps> = ({
  user,
  userId,
}) => {
  const isMyUserCard = user.id === userId;

  const {
    isShown: isShownDeleteAdminModal,
    show: showDeleteAdminModal,
    hide: hideDeleteAdminModal,
  } = useShowHide();

  const showDeleteModal = () => {
    if (isMyUserCard) {
      return;
    }

    showDeleteAdminModal();
  };

  const { src: userAvatar, isLoading: isImageLoading } = useValidImage(
    user?.pictureUrl,
    DEFAULT_AVATAR
  );

  return (
    <div className="px-6 py-4 w-full flex flex-row gap-x-4 items-center ">
      <div className=" whitespace-nowrap flex flex-row w-full">
        <img
          className="h-10 w-10 rounded-full"
          src={!isImageLoading ? userAvatar : DEFAULT_AVATAR}
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
      <div className="flex flex-row w-full justify-end">
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
    </div>
  );
};
