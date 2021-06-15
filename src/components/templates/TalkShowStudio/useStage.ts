import { useRecentVenueUsers } from "../../../hooks/users";
import { useCallback, useEffect, useMemo } from "react";
import { PlaceInTalkShowStudioVenue } from "../../../types/User";
import { useVenueId } from "../../../hooks/useVenueId";
import { useUser } from "../../../hooks/useUser";
import { updateTalkShowStudioExperience } from "../../../api/profile";

const MAX_HOSTS = 5;

export const useStage = () => {
  const venueId = useVenueId();
  const { recentVenueUsers } = useRecentVenueUsers();
  const { userId, profile } = useUser();

  const setDefaultUserSettings = useCallback(async () => {
    venueId &&
      userId &&
      (await updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          isSharingScreen: false,
          place: PlaceInTalkShowStudioVenue.audience,
          isMuted: false,
        },
      }));
  }, [userId, venueId]);

  useEffect(() => {
    window.addEventListener("beforeunload", setDefaultUserSettings);
    return () => {
      window.removeEventListener("beforeunload", setDefaultUserSettings, false);
    };
  }, [setDefaultUserSettings]);

  const peopleOnStage = useMemo(
    () =>
      venueId
        ? recentVenueUsers.filter(
            (user) =>
              user.data?.[venueId]?.place === PlaceInTalkShowStudioVenue.stage
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
              PlaceInTalkShowStudioVenue.requesting
          )
        : [],
    [recentVenueUsers, venueId]
  );

  const isUserRequesting = useMemo(
    () => peopleRequesting.some((user) => user.id === userId),
    [peopleRequesting, userId]
  );

  const isUserOnStage = useMemo(
    () => peopleOnStage.some((user) => user.id === userId),
    [peopleOnStage, userId]
  );

  const canJoinStage = useMemo(() => peopleOnStage.length <= MAX_HOSTS, [
    peopleOnStage,
  ]);

  const screenSharingUser = useMemo(
    () =>
      peopleOnStage.find(
        (user) => venueId && user.data?.[venueId].isSharingScreen
      ),
    [peopleOnStage, venueId]
  );

  const canShareScreen = useMemo(() => !screenSharingUser, [screenSharingUser]);

  const isUserSharing = useMemo(
    () => !!userId && screenSharingUser?.id === userId,
    [screenSharingUser, userId]
  );

  const joinStage = () => {
    venueId &&
      userId &&
      updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          place: PlaceInTalkShowStudioVenue.stage,
        },
      });
  };

  const leaveStage = async () => {
    // TODO: clear agoraIds for user when left Stage
    await setDefaultUserSettings();
  };

  const requestJoinStage = () => {
    venueId &&
      userId &&
      updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          place: PlaceInTalkShowStudioVenue.requesting,
        },
      });
  };

  const toggleMute = () => {
    venueId &&
      userId &&
      updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          isMuted: !profile?.data?.[venueId].isMuted,
        },
      });
  };

  return {
    peopleOnStage,
    peopleRequesting,
    isUserRequesting,
    screenSharingUser,
    isUserSharing,
    isUserOnStage,
    canJoinStage,
    canShareScreen,
    joinStage,
    leaveStage,
    requestJoinStage,
    toggleMute,
  };
};
