import { useProfileById } from "hooks/user/useProfileById";

import { Loading } from "components/molecules/Loading";

import { MiniProfileModal, MiniProfileModalProps } from "./MiniProfileModal";

export const MiniProfileModalHoc: React.FC<
  Omit<MiniProfileModalProps, "profile">
> = (props) => {
  const { isLoaded: isProfileByIdLoaded, profile } = useProfileById(props);

  if (!isProfileByIdLoaded || !profile) return <Loading />;

  return <MiniProfileModal profile={profile} {...props} />;
};
