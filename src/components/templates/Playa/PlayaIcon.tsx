import React from "react";
import { AnyVenue, PlayaIcon, Venue } from "types/venues";
import { WithId } from "utils/id";

type PropsType = {
  playaIcon?: PlayaIcon;
  venues?: WithId<AnyVenue>[];
  showVenue: (venue: WithId<Venue>) => void;
};

export const PlayaIconComponent: React.FunctionComponent<PropsType> = ({
  playaIcon,
  venues,
  showVenue,
}) => {
  return !!playaIcon && playaIcon.visible === true ? (
    <div
      className={`playa-icon ${playaIcon.className} ${
        playaIcon.clickable ? "clickable" : ""
      }`}
      style={{
        left: playaIcon.x,
        top: playaIcon.y,
      }}
      onClick={() => {
        if (playaIcon.clickable && !!playaIcon.venueId) {
          const venueToShow = venues?.find((v) => playaIcon.venueId === v.id);
          if (!!venueToShow) {
            showVenue(venueToShow);
          }
        }
      }}
    >
      {playaIcon.fire && (
        <div className="fire">
          {Array.from(Array(50)).map((_, index) => (
            <div className="particle" key={index} />
          ))}
        </div>
      )}
      {playaIcon.clickable && (
        <div className="clickable-banner">Click Me Now!</div>
      )}
    </div>
  ) : (
    <></>
  );
};
