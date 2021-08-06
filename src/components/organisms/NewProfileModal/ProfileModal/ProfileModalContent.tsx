import { useSameUser } from "hooks/useIsSameUser";
import React from "react";
import { ProfileModalSendMessageButton } from "components/organisms/NewProfileModal/components/buttons/ProfileModalSendMessageButton/ProfileModalSendMessageButton";
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
  onOpenViewingUserChat?: () => void;
  onEditMode?: () => void;
}

export const ProfileModalContent: React.FC<Props> = ({
  viewingUser,
  onOpenViewingUserChat,
  onEditMode,
  venue,
}: Props) => {
  const { questions, answers } = useProfileQuestions(viewingUser, venue?.id);

  const sameUser = useSameUser(viewingUser);

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
      {onOpenViewingUserChat && !sameUser && (
        <ProfileModalSendMessageButton
          containerClassName="ProfileModal__section"
          openChat={onOpenViewingUserChat}
          viewingUser={viewingUser}
        />
      )}
    </>
  );
};
