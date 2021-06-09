import { useRecentVenueUsers } from "../../../hooks/users";
import { useCallback, useEffect, useMemo } from "react";
import { PlaceInFullTalkShowVenue } from "../../../types/User";
import { useVenueId } from "../../../hooks/useVenueId";
import { useUser } from "../../../hooks/useUser";
import {
  updatePlaceInRoom,
  updateScreenShareStatus,
} from "../../../api/profile";

const MAX_HOSTS = 5;

const useStage = () => {
  const venueId = useVenueId();
  const { recentVenueUsers } = useRecentVenueUsers();
  const { userId } = useUser();

  const setDefaultUserSettings = useCallback(async () => {
    if (venueId && userId) {
      await updatePlaceInRoom({
        venueId,
        userId,
        place: PlaceInFullTalkShowVenue.audience,
      });
      await updateScreenShareStatus({
        venueId,
        userId,
        isSharingScreen: false,
      });
    }
  }, [userId, venueId]);

  useEffect(() => {
    setDefaultUserSettings();
  }, [setDefaultUserSettings]);

  const peopleOnStage = useMemo(
    () =>
      venueId
        ? recentVenueUsers.filter(
            (user) =>
              user.data?.[venueId]?.place === PlaceInFullTalkShowVenue.stage
          )
        : [],
    [recentVenueUsers, venueId]
  );

  const peopleRequesting = useMemo(
    () =>
      venueId
        ? recentVenueUsers.filter(
            (user) =>
              user.data?.[venueId]?.place ===
              PlaceInFullTalkShowVenue.requesting
          )
        : [],
    [recentVenueUsers, venueId]
  );

  const isUserOnStage = useMemo(
    () => peopleOnStage.some((user) => user.id === userId),
    [peopleOnStage, userId]
  );

  const canJoinStage = useMemo(() => peopleOnStage.length <= MAX_HOSTS, [
    peopleOnStage,
  ]);

  const canShareScreen = useMemo(
    () =>
      !peopleOnStage.find(
        (user) => venueId && user.data?.[venueId].isSharingScreen
      ),
    [peopleOnStage, venueId]
  );

  const joinStage = () => {
    venueId &&
      userId &&
      updatePlaceInRoom({
        venueId,
        userId,
        place: PlaceInFullTalkShowVenue.stage,
      });
  };

  const leaveStage = () => {
    venueId &&
      userId &&
      updatePlaceInRoom({
        venueId,
        userId,
        place: PlaceInFullTalkShowVenue.audience,
      });
  };

  const requestJoinStage = () => {
    venueId &&
      userId &&
      updatePlaceInRoom({
        venueId,
        userId,
        place: PlaceInFullTalkShowVenue.requesting,
      });
  };

  return {
    peopleOnStage,
    peopleRequesting,
    isUserOnStage,
    canJoinStage,
    canShareScreen,
    joinStage,
    leaveStage,
    requestJoinStage,
  };
};

export default useStage;
