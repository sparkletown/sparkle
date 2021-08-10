import React from "react";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { playaAddress } from "utils/address";

import { useSelector } from "hooks/useSelector";

import "./PlayaAddress.scss";

const PlayaAddress: React.FC = () => {
  const location = useSelector((state) => state.location);
  if (!location?.x || !location?.y) return <></>;

  return (
    <div className="playa_address-container">
      <FontAwesomeIcon icon={faLocationArrow} className="playa_address-icon" />{" "}
      {playaAddress(location.x, location.y)}
    </div>
  );
};

export default PlayaAddress;
