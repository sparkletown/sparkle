import React from "react";
import { ProfileModalButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalButtons/ProfileModalButtons";
import { ProfileModalBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "components/organisms/NewProfileModal/components/ProfileModalBadges/ProfileModalBadges";
import "./ProfileModal.scss";
import { User } from "types/User";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { useProfileQuestions } from "../useProfileQuestions";

interface Props {
  viewingUser: WithId<User>;
  venue: WithId<AnyVenue>;
  onPrimaryButtonClick: () => void;
  onEditMode?: () => void;
}

export const ProfileModalContent: React.FC<Props> = ({
  viewingUser,
  onPrimaryButtonClick,
  onEditMode,
  venue,
}: Props) => {
  const { questions, answers } = useProfileQuestions(viewingUser, venue?.id);

  return (
    <>
      <ProfileModalBasicInfo viewingUser={viewingUser} onEdit={onEditMode} />
      <ProfileModalQuestions
        containerClassName="ProfileModal__section"
        questions={questions}
        answers={answers}
      />
      <ProfileModalLinks
        viewingUser={viewingUser}
        containerClassName="ProfileModal__section"
      />
      <ProfileModalBadges
        viewingUser={viewingUser}
        containerClassName={"ProfileModal__section"}
        venue={venue}
      />
      <ProfileModalButtons
        containerClassName="ProfileModal__section"
        onClick={onPrimaryButtonClick}
        viewingUser={viewingUser}
      />
    </>
  );
};
