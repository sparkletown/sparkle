import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { ATTENDEE_INSIDE_URL } from "settings";

import { SpaceWithId } from "types/id";
import { UserPresenceDocument } from "types/userPresence";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { UserAvatar } from "components/atoms/UserAvatar";

import { BoothCard } from "./BoothCard";

import styles from "./BoothCard.module.scss";

interface BoothProps {
  space: SpaceWithId;
  presentUsers: UserPresenceDocument[];
}

export const Booth: React.FC<BoothProps> = ({ space, presentUsers }) => {
  const { worldSlug } = useWorldParams();
  const history = useHistory();

  const goToSpace = useCallback(() => {
    const url = generateUrl({
      route: ATTENDEE_INSIDE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: {
        worldSlug,
        spaceSlug: space.slug,
      },
    });
    history.push(url);
  }, [history, space.slug, worldSlug]);

  const usersInBoothCount = presentUsers.length;
  const usersInBooth = presentUsers;

  const presenceUsers = useMemo(() => {
    return usersInBooth.map((user) => {
      return <UserAvatar key={user.id} user={user} size="small" />;
    });
  }, [usersInBooth]);

  const countText = useMemo(() => {
    if (!usersInBoothCount) {
      return "Empty";
    }
    if (usersInBoothCount === 1) {
      return "1 person inside";
    }
    return `${usersInBoothCount} people inside`;
  }, [usersInBoothCount]);

  return (
    <BoothCard title={space.name} buttonText="Join" onButtonClick={goToSpace}>
      <div className={styles.presenceContainer}>
        <span className={styles.presenceCount}>{countText}</span>
        <span className={styles.presenceUsers}>{presenceUsers}</span>
      </div>
    </BoothCard>
  );
};
