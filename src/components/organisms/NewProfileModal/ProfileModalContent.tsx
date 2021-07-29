import { User } from "../../../types/User";
import { AnyVenue } from "../../../types/venues";
import { WithId } from "../../../utils/id";
import { Badges } from "../Badges";
import { ProfileModalContentBasicInfo } from "./ProfileModalBasicInfo/ProfileModalContentBasicInfo";
import { ProfileModalButtons } from "./ProfileModalButtons/ProfileModalButtons";
import "./ProfileModalContent.scss";
import { ProfileModalLinks } from "./ProfileModalLinks/ProfileModalLinks";
import { ProfileModalQuestions } from "./ProfileModalQuestions/ProfileModalQuestions";
import React from "react";

interface Props {
  venue: WithId<AnyVenue>;
  chosenUser: WithId<User>;
  openChat: () => void;
}

export const ProfileModalContent: React.FC<Props> = ({
  venue,
  chosenUser,
  openChat,
}: Props) => {
  return (
    <div className="ProfileModalContent">
      <ProfileModalContentBasicInfo />
      <ProfileModalQuestions className="ProfileModalContent__section" />
      <ProfileModalLinks className="ProfileModalContent__section" />
      {venue?.showBadges && chosenUser && (
        <Badges
          containerClassName="ProfileModalContent__section"
          user={chosenUser}
          currentVenue={venue}
        />
      )}
      <ProfileModalButtons
        containerClassName="ProfileModalContent__section"
        openChat={openChat}
        chosenUser={chosenUser}
      />
    </div>
  );
};
