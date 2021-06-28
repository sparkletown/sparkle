import { useCallback, useEffect, useMemo } from "react";

import { MAX_TALK_SHOW_STUDIO_HOSTS } from "settings";

import { PlaceInTalkShowStudioVenue, User } from "types/User";

import { updateTalkShowStudioExperience } from "api/profile";
import { updateUserTalkShowStudioExperience } from "api/admin";

import { WithId } from "utils/id";
import { isDefined } from "utils/types";

import { useUser } from "hooks/useUser";
import { useRecentVenueUsers } from "hooks/users";

export interface UseStageProps {
  venueId?: string;
}

export const useStage = ({ venueId }: UseStageProps) => {
  const { recentVenueUsers } = useRecentVenueUsers();
  const { userId, profile } = useUser();

  const setDefaultUserSettings = useCallback(async () => {
    if (!venueId || !userId) return;

    await updateTalkShowStudioExperience({
      venueId,
      userId,
      experience: {
        isSharingScreen: false,
        place: PlaceInTalkShowStudioVenue.audience,
        isMuted: false,
        isUserCameraOff: false,
      },
    });
  }, [userId, venueId]);

  // @debt we probably shouldn't be using beforeunload here
  useEffect(() => {
    window.addEventListener("beforeunload", setDefaultUserSettings);
    return () => {
      window.removeEventListener("beforeunload", setDefaultUserSettings, false);
    };
  }, [setDefaultUserSettings]);

  const peopleOnStage = useMemo(() => {
    if (!venueId) return [];

    return recentVenueUsers.filter(
      (user) => user.data?.[venueId]?.place === PlaceInTalkShowStudioVenue.stage
    );
  }, [recentVenueUsers, venueId]);

  const peopleRequesting = useMemo(() => {
    if (!venueId) return [];

    return recentVenueUsers.filter(
      (user) =>
        user.data?.[venueId]?.place === PlaceInTalkShowStudioVenue.requesting
    );
  }, [recentVenueUsers, venueId]);

  const isUserRequesting = useMemo(
    () => peopleRequesting.some((user) => user.id === userId),
    [peopleRequesting, userId]
  );

  const isUserOnStage = useMemo(
    () => peopleOnStage.some((user) => user.id === userId),
    [peopleOnStage, userId]
  );

  const canJoinStage = peopleOnStage.length < MAX_TALK_SHOW_STUDIO_HOSTS;

  const screenSharingUser = useMemo(() => {
    if (!venueId) return;

    return peopleOnStage.find((user) => user.data?.[venueId].isSharingScreen);
  }, [peopleOnStage, venueId]);

  const canShareScreen = !isDefined(screenSharingUser);

  const isUserSharing = isDefined(userId) && screenSharingUser?.id === userId;

  const joinStage = () => {
    if (!venueId || !userId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
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
    if (!venueId || !userId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
    updateTalkShowStudioExperience({
      venueId,
      userId,
      experience: {
        place: PlaceInTalkShowStudioVenue.requesting,
      },
    });
  };

  const toggleMicrophone = () => {
    if (!venueId || !userId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
    updateTalkShowStudioExperience({
      venueId,
      userId,
      experience: {
        isMuted: !profile?.data?.[venueId].isMuted,
      },
    });
  };

  const toggleCamera = () => {
    if (!venueId || !userId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
    updateTalkShowStudioExperience({
      venueId,
      userId,
      experience: {
        isUserCameraOff: !profile?.data?.[venueId].isUserCameraOff,
      },
    });
  };

  const toggleUserMicrophone = (user?: WithId<User>) => {
    if (!user || !venueId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
    updateUserTalkShowStudioExperience(venueId, user.id, {
      isMuted: true,
    });
  };

  const toggleUserCamera = (user?: WithId<User>) => {
    if (!user || !venueId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
    updateUserTalkShowStudioExperience(venueId, user.id, {
      isUserCameraOff: true,
    });
  };

  const removeUserFromStage = (user?: WithId<User>) => {
    if (!user || !venueId) return;

    // @debt promise returned from updateTalkShowStudioExperience is ignored
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
