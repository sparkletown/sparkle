import React from "react";

import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfileQuestions } from "hooks/useProfileQuestions";

import { ProfileModalButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalButtons";
import { ProfileModalBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicInfo";
import { ProfileModalLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks";
import { ProfileModalBadges } from "components/organisms/NewProfileModal/components/ProfileModalBadges";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions";

import "./ProfileModalContent.scss";

export interface ProfileModalContentProps {
  user: WithId<User>;
  venue?: WithId<AnyVenue>;
  onPrimaryButtonClick: () => void;
  onEditMode?: () => void;
}

export const ProfileModalContent: React.FC<ProfileModalContentProps> = ({
  user,
  onPrimaryButtonClick,
  onEditMode,
  venue,
}) => {
  const { questions, answers } = useProfileQuestions(user, venue?.worldId);

  return (
    <>
      <ProfileModalBasicInfo user={user} onEdit={onEditMode} />
      <ProfileModalQuestions
        containerClassName="ProfileModalContent__section"
        questions={questions}
        answers={answers}
      />
      <ProfileModalLinks
        user={user}
        containerClassName="ProfileModalContent__section"
      />
      <ProfileModalBadges
        user={user}
        containerClassName={"ProfileModalContent__section"}
        venue={venue}
      />
      <ProfileModalButtons
        containerClassName="ProfileModalContent__section"
        onClick={onPrimaryButtonClick}
        user={user}
      />
    </>
  );
};
