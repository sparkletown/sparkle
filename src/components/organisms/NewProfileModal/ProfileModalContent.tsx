import { useUser } from "../../../hooks/useUser";
import { AnyVenue } from "../../../types/venues";
import { WithId } from "../../../utils/id";
import { Badges } from "../Badges";
import { ProfileModalContentBasicInfo } from "./ProfileModalBasicInfo/ProfileModalContentBasicInfo";
import "./ProfileModalContent.scss";
import { ProfileModalLinks } from "./ProfileModalLinks/ProfileModalLinks";
import { ProfileModalQuestions } from "./ProfileModalQuestions/ProfileModalQuestions";
import React from "react";

interface Props {
  venue: WithId<AnyVenue>;
}

export const ProfileModalContent: React.FC<Props> = ({ venue }: Props) => {
  const { userWithId } = useUser();

  return (
    <div className="ProfileModalContent">
      <ProfileModalContentBasicInfo />
      <ProfileModalQuestions className="ProfileModalContent__badges" />
      <ProfileModalLinks />
      {venue?.showBadges && userWithId && (
        <Badges
          className="ProfileModalContent__badges"
          user={userWithId}
          currentVenue={venue}
        />
      )}
    </div>
  );
};
