import React from "react";
import { WithId } from "../../../../utils/id";
import { AnyVenue } from "../../../../types/venues";
import { useUser } from "../../../../hooks/useUser";
import { Badges } from "../../Badges";
import { ContainerClassName } from "../../../../types/utility";

interface Props extends ContainerClassName {
  venue: WithId<AnyVenue>;
}

export const ProfileModalBadges: React.FC<Props> = ({
  venue,
  containerClassName,
}) => {
  const { userWithId } = useUser();

  return (
    <>
      {venue?.showBadges && userWithId && (
        <Badges
          containerClassName={containerClassName}
          user={userWithId}
          currentVenue={venue}
        />
      )}
    </>
  );
};
