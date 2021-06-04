import { useRecentVenueUsers } from "../../../hooks/users";
import { useMemo } from "react";
import { PlaceInScreenshareVenue } from "../../../types/User";
import { useVenueId } from "../../../hooks/useVenueId";
import { useUser } from "../../../hooks/useUser";
import { updatePlaceInScreenshareVenue } from "../../../api/profile";

const MAX_HOSTS = 5;

const useStage = () => {
  const venueId = useVenueId();
  const { recentVenueUsers } = useRecentVenueUsers();
  const { userId } = useUser();

  const peopleOnStage = useMemo(
    () =>
      venueId
        ? recentVenueUsers.filter(
            (user) =>
              user.data?.[venueId]?.placeInScreenshareVenue ===
              PlaceInScreenshareVenue.stage
          )
        : [],
    [recentVenueUsers, venueId]
  );

  const peopleRequesting = useMemo(
    () =>
      venueId
        ? recentVenueUsers.filter(
            (user) =>
              user.data?.[venueId]?.placeInScreenshareVenue ===
              PlaceInScreenshareVenue.requesting
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
      peopleOnStage.some(
        (user) => venueId && !user.data?.[venueId].isSharingScreen
      ),
    [peopleOnStage, venueId]
  );

  const joinStage = () => {
    venueId &&
      userId &&
      updatePlaceInScreenshareVenue({
        venueId,
        userId,
        placeInScreenshareVenue: PlaceInScreenshareVenue.stage,
      });
  };

  const leaveStage = () => {
    venueId &&
      userId &&
      updatePlaceInScreenshareVenue({
        venueId,
        userId,
        placeInScreenshareVenue: PlaceInScreenshareVenue.audience,
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
  };
};

export default useStage;
