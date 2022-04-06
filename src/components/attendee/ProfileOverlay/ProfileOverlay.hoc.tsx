import { useUser } from "hooks/user/useUser";

import { Loading } from "components/molecules/Loading";

import { ProfileOverlay, ProfileOverlayProps } from "./ProfileOverlay";

export const ProfileOverlayHoc: React.FC<
  Omit<ProfileOverlayProps, "profile">
> = (props) => {
  const { userWithId, isLoading: isProfileLoading } = useUser();

  if (isProfileLoading || !userWithId) return <Loading />;

  return <ProfileOverlay profile={userWithId} {...props} />;
};
