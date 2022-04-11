import { useLiveUser } from "hooks/user/useLiveUser";

import { Loading } from "components/molecules/Loading";

import { ProfileOverlay, ProfileOverlayProps } from "./ProfileOverlay";

export const ProfileOverlayHoc: React.FC<
  Omit<ProfileOverlayProps, "profile">
> = (props) => {
  const { userWithId, isLoading: isProfileLoading } = useLiveUser();

  if (isProfileLoading || !userWithId) return <Loading />;

  return <ProfileOverlay profile={userWithId} {...props} />;
};
