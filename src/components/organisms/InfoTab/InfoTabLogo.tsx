import React, { FC } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import {
  faAmbulance,
  faEdit,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

interface InfoTabLogoProps {
  iconNameOrPath?: string;
  isInfoTabShown: boolean;
}

type ValidLogoIconName = "ambulance" | "create" | "heart" | "info";

const logoMap: Record<ValidLogoIconName, IconDefinition> = {
  ambulance: faAmbulance,
  create: faEdit,
  heart: faHeart,
  info: faInfoCircle,
};

export const InfoTabLogo: FC<InfoTabLogoProps> = ({
  iconNameOrPath,
  isInfoTabShown,
}) => {
  const iconPath = logoMap[iconNameOrPath as ValidLogoIconName];

  const infoTabLogoClasses = classNames("InfoTab__logo", {
    "InfoTab__logo--expanded": isInfoTabShown,
  });

  return (
    <div className="InfoTab__logoWrapper">
      {iconPath !== undefined ? (
        <FontAwesomeIcon
          className={infoTabLogoClasses}
          icon={iconPath}
          size="2x"
        />
      ) : (
        <img
          className={infoTabLogoClasses}
          src={iconNameOrPath}
          alt="experience-logo"
        />
      )}
    </div>
  );
};
