import React from "react";
import { Venue } from "types/Venue";
import { getLinkFromText } from "utils/getLinkFromText";
import { IS_BURN } from "secrets";

type PropsType = {
  venue?: Venue;
};

const BannerMessage: React.FC<PropsType> = ({ venue }) => {
  return venue?.bannerMessage ? (
    <div className="playa-banner split-words">
      <strong>{IS_BURN ? "SparkleVerse" : venue.name} Announcement:</strong>{" "}
      {getLinkFromText(venue.bannerMessage)}
    </div>
  ) : (
    <></>
  );
};

export default BannerMessage;
