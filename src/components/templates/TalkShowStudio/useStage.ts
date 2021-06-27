import { useCallback, useEffect, useMemo } from "react";

import { MAX_TALK_SHOW_STUDIO_HOSTS } from "settings";

import { PlaceInTalkShowStudioVenue, User } from "types/User";

import { updateTalkShowStudioExperience } from "api/profile";
import { updateUserTalkShowStudioExperience } from "api/admin";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useRecentVenueUsers } from "hooks/users";

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
          isUserCameraOff: false,
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

  const canJoinStage = useMemo(
    () => peopleOnStage.length < MAX_TALK_SHOW_STUDIO_HOSTS,
    [peopleOnStage]
  );

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

  const toggleMicrophone = () => {
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

  const toggleCamera = () => {
    venueId &&
      userId &&
      updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          isUserCameraOff: !profile?.data?.[venueId].isUserCameraOff,
        },
      });
  };

  const toggleUserMicrophone = (user?: WithId<User>) => {
    if (user && venueId) {
      updateUserTalkShowStudioExperience(venueId, user.id, {
        isMuted: true,
      });
    }
  };

  const toggleUserCamera = (user?: WithId<User>) => {
    if (user && venueId) {
      updateUserTalkShowStudioExperience(venueId, user.id, {
        isUserCameraOff: true,
      });
    }
  };

  const removeUserFromStage = (user?: WithId<User>) => {
    user &&
      venueId &&
      updateUserTalkShowStudioExperience(venueId, user.id, {
        place: PlaceInTalkShowStudioVenue.audience,
        isSharingScreen: false,
        isMuted: false,
        isUserCameraOff: false,
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
    toggleMicrophone,
    toggleCamera,
    toggleUserMicrophone,
    toggleUserCamera,
    removeUserFromStage,
  };
};
