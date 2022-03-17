import React from "react";

import { UserWithId } from "types/id";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useProfileQuestions } from "hooks/useProfileQuestions";

import { Badges } from "components/organisms/Badges";

import { ProfileModalButtons } from "./buttons/ProfileModalButtons";
import { ProfileModalBasicInfo } from "./header/ProfileModalBasicInfo";
import { ProfileModalLinks } from "./links/ProfileModalLinks";
import { ProfileModalQuestions } from "./ProfileModalQuestions";

export interface ProfileModalContentProps {
  user: UserWithId;
  onPrimaryButtonClick: () => void;
  onEditMode?: () => void;
  onModalClose: () => void;
}

export const ProfileModalContent: React.FC<ProfileModalContentProps> = ({
  user,
  onPrimaryButtonClick,
  onEditMode,
  onModalClose,
}) => {
  const { worldId, space } = useWorldAndSpaceByParams();
  const { questions, answers } = useProfileQuestions(user, worldId);

  return (
    <div className="ProfileModalContent">
      <div className="sm:flex sm:items-start">
        <div>
          <ProfileModalBasicInfo user={user} />
          <ProfileModalQuestions questions={questions} answers={answers} />
          <ProfileModalLinks user={user} />
          {space && <Badges user={user} currentVenue={space} />}
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <ProfileModalButtons
          onClick={onPrimaryButtonClick}
          onEdit={onEditMode}
          onModalClose={onModalClose}
          user={user}
        />
      </div>
    </div>
  );
};
