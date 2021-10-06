import sparkleLogoIcon from "assets/icons/sparkle-logo-icon.svg";

import "./SparkleLogoIcon.scss";

export const SparkleLogoIcon = () => (
  <div className="SparkleLogoIcon">
    <img
      className="SparkleLogoIcon__logo"
      src={sparkleLogoIcon}
      alt="sparkle logo"
    />
  </div>
);
