import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DEFAULT_AVATAR } from "settings";

import { AlgoliaUser } from "types/User";

import { useValidImage } from "hooks/image/useValidImage";

interface SelectedUserCardProps {
  user: AlgoliaUser;
  onCardClick: () => void;
}

export const SelectedUserCard: React.FC<SelectedUserCardProps> = ({
  user,
  onCardClick,
}) => {
  const { src: userAvatar, isLoading: isImageLoading } = useValidImage(
    user?.pictureUrl,
    DEFAULT_AVATAR
  );

  return (
    <div className="m-1 p-2 select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-sparkle-lighter text-white">
      <img
        className="h-10 w-10 rounded-full"
        src={isImageLoading ? DEFAULT_AVATAR : userAvatar}
        alt="profileUrl"
      />
      <div className="px-2 flex self-center">{user.partyName}</div>
      <div
        className="ml-1 w-4 h-4 self-center text-center align-center justify-center items-center cursor-pointer select-none inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100 cursor-pointer"
        onClick={onCardClick}
      >
        <FontAwesomeIcon icon={faClose} />
      </div>
    </div>
  );
};
