import classNames from "classnames";

import { DEFAULT_AVATAR } from "settings";

import { AlgoliaUser } from "types/User";

import { useValidImage } from "hooks/image/useValidImage";

interface FoundUserCardProps {
  user: AlgoliaUser;
  isSelected: boolean;
  onCardClick: () => void;
}

export const FoundUserCard: React.FC<FoundUserCardProps> = ({
  user,
  isSelected,
  onCardClick,
}) => {
  const { src: userAvatar, isLoading: isImageLoading } = useValidImage(
    user?.pictureUrl,
    DEFAULT_AVATAR
  );

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
    <div key={user.objectID} className={foundUserClasses} onClick={onCardClick}>
      <img
        className="h-10 w-10 rounded-full"
        src={isImageLoading ? DEFAULT_AVATAR : userAvatar}
        alt="profileUrl"
      />
      <div className="px-2 flex self-center">{user.partyName}</div>
      {isSelected && <div className={selectedClasses}>Already added</div>}
    </div>
  );
};
