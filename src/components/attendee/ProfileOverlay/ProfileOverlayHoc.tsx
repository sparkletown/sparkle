import React from "react";

import { useLiveProfile } from "hooks/user/useLiveProfile";
import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";

import { ProfileOverlay } from "./ProfileOverlay";

export const ProfileOverlayHoc: React.FC = () => {
  const authResult = useUserId();
  const { userWithId, isLoading } = useLiveProfile(authResult);

  if (isLoading) {
    return <Loading />;
  }

  if (!userWithId) {
    // @debt should there be UI/UX solution for missing user?
    return null;
  }

  return <ProfileOverlay user={userWithId} />;
};
