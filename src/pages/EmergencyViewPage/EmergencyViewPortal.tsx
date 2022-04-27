import React from "react";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Room } from "types/rooms";

import { getFirebaseStorageResizedImage } from "utils/image";

import { usePortal } from "hooks/usePortal";
import { useRelatedVenues } from "hooks/useRelatedVenues";

type EmergencyViewPortalProps = {
  portal: Room;
  isLive: boolean;
};

export const EmergencyViewPortal: React.FC<EmergencyViewPortalProps> = ({
  portal,
  isLive,
}) => {
  const { enterPortal, portalSpaceId } = usePortal({ portal });

  const { worldSpacesById } = useRelatedVenues({});
  const portalVenue = portalSpaceId && worldSpacesById[portalSpaceId];

  const portalImage = getFirebaseStorageResizedImage(portal.image_url, {
    fit: "crop",
    width: 100,
    height: 100,
  });

  return (
    <div className="EmergencyView__room">
      <div className="EmergencyView__info">
        {isLive && <span className="EmergencyView__info-status">Live</span>}
        <div className="EmergencyView__info-audience">
          <FontAwesomeIcon icon={faUserFriends} size="sm" />
          <span>{portalVenue?.recentUserCount}</span>
        </div>
      </div>
      <div className="EmergencyView__body" onClick={enterPortal}>
        <img
          className="EmergencyView__body-image"
          src={portalImage}
          alt={portal.title}
        />
        <span>{portal.title}</span>
      </div>
    </div>
  );
};
