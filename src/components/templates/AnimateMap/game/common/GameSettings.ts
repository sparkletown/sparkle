import defaultProfilePic1 from "assets/avatars/default-profile-pic-1.png";
import defaultProfilePic2 from "assets/avatars/default-profile-pic-2.png";
import defaultProfilePic3 from "assets/avatars/default-profile-pic-3.png";
import defaultProfilePic4 from "assets/avatars/default-profile-pic-4.png";
import defaultProfilePic5 from "assets/avatars/default-profile-pic-5.png";
import defaultProfilePic6 from "assets/avatars/default-profile-pic-6.png";

type PortalBox = {
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
};

export const DEFAULT_AVATAR_LIST: string[] = [
  defaultProfilePic1,
  defaultProfilePic2,
  defaultProfilePic3,
  defaultProfilePic4,
  defaultProfilePic5,
  defaultProfilePic6,
];
Object.freeze(DEFAULT_AVATAR_LIST);

export const DEFAULT_PORTAL_BOX: PortalBox = {
  width_percent: 5,
  height_percent: 5,
  x_percent: 50,
  y_percent: 50,
};
Object.freeze(DEFAULT_PORTAL_BOX);

export const DEFAULT_PARTY_NAME = "Anon";
