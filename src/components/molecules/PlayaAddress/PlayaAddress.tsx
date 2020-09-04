import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { playaAddress } from "utils/address";
import { LocationContext } from "components/context/LocationContext";
import "./PlayaAddress.scss";

const PlayaAddress: React.FC = () => {
  const locationContext = useContext(LocationContext);
  if (!locationContext?.location?.x || !locationContext?.location?.y)
    return <></>;

  return (
    <div className="playa_address-container">
      <FontAwesomeIcon icon={faLocationArrow} className="playa_address-icon" />{" "}
      {playaAddress(locationContext.location.x, locationContext.location.y)}
    </div>
  );
};

export default PlayaAddress;
