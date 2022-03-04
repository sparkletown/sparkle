import React from "react";

import { SpaceWithId, UserWithId } from "types/id";

import { useProfileQuestions } from "hooks/useProfileQuestions";

import { Badges } from "components/organisms/Badges";
import { ProfileModalButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalButtons";
import { ProfileModalBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicInfo";
import { ProfileModalLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions";

import "./ProfileModalContent.scss";

interface ProfileModalContentProps {
  user: UserWithId;
  space?: SpaceWithId;
  onPrimaryButtonClick: () => void;
  onEditMode?: () => void;
}

export const ProfileModalContent: React.FC<ProfileModalContentProps> = ({
  user,
  onPrimaryButtonClick,
  onEditMode,
  space,
}) => {
  const { questions, answers } = useProfileQuestions(user, space?.worldId);

  return (
    <div className="ProfileModalContent">
      <ProfileModalBasicInfo user={user} onEdit={onEditMode} />
      <ProfileModalQuestions questions={questions} answers={answers} />
      <ProfileModalLinks user={user} />
      {space && <Badges user={user} currentVenue={space} />}
      <ProfileModalButtons onClick={onPrimaryButtonClick} user={user} />
    </div>
  );
};
