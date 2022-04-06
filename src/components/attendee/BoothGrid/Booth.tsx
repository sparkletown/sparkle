import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";

import { ATTENDEE_INSIDE_URL } from "settings";

import { SpaceWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { UserAvatar } from "components/atoms/UserAvatar";

import styles from "./Booth.module.scss";

interface BoothProps {
  space: SpaceWithId;
}
export const Booth: React.FC<BoothProps> = ({ space }) => {
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

  // @debt these numbers/samples aren't live. There's a bigger piece of work
  // needed to build up a more live stream of where users are that is beyond
  // the scope of this component. These constants are used here so that when
  // that work is done the data should be able to be put into the constants with
  // minimal rework.
  const usersInBoothCount = space.recentUserCount;
  const usersInBooth = useMemo(() => space.recentUsersSample || [], [
    space.recentUsersSample,
  ]);

  const presenceUsers = useMemo(() => {
    return usersInBooth.map((user, idx) => {
      return <UserAvatar key={user.id} user={user} size="small" />;
    });
  }, [usersInBooth]);

  const countText = useMemo(() => {
    if (!usersInBoothCount) {
      return "Empty";
    }
    if (usersInBoothCount === 1) {
      return "1 person here";
    }
    return `${usersInBoothCount} people here`;
  }, [usersInBoothCount]);

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <span className={styles.title}>{space.name}</span>
        <div className={styles.presenceContainer}>
          <span className={styles.presenceCount}>{countText}</span>
          <span className={styles.presenceUsers}>{presenceUsers}</span>
        </div>
      </div>
      <Button variant="panel-primary" onClick={goToSpace}>
        Join
      </Button>
    </div>
  );
};
