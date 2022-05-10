import defaultProfilePic1 from "assets/avatars/default-profile-pic-1.png";
import defaultProfilePic2 from "assets/avatars/default-profile-pic-2.png";
import defaultProfilePic3 from "assets/avatars/default-profile-pic-3.png";
import defaultProfilePic4 from "assets/avatars/default-profile-pic-4.png";
import defaultProfilePic5 from "assets/avatars/default-profile-pic-5.png";
import defaultProfilePic6 from "assets/avatars/default-profile-pic-6.png";
import defaultMapIcon from "assets/icons/default-map-icon.png";
import sparkleNavLogo from "assets/icons/sparkle-nav-logo.png";
import sparkleverseLogo from "assets/images/sparkleverse-logo.png";

export const DEFAULT_AVATAR_LIST: string[] = [
  defaultProfilePic1,
  defaultProfilePic2,
  defaultProfilePic3,
  defaultProfilePic4,
  defaultProfilePic5,
  defaultProfilePic6,
];
Object.freeze(DEFAULT_AVATAR_LIST);

export const DEFAULT_AVATAR = DEFAULT_AVATAR_LIST?.[0];
export const DEFAULT_BADGE_IMAGE = sparkleNavLogo;
export const DEFAULT_MAP_ICON_URL = defaultMapIcon;
export const SPARKLEVERSE_LOGO_URL = sparkleverseLogo;
