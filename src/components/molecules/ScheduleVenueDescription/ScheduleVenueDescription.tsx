import React, { FC } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useValidImage } from "hooks/useCheckImage";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./ScheduleVenueDescription.scss";

export const ScheduleVenueDescription: FC = () => {
  const { spaceSlug } = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);

  const [venueIcon] = useValidImage(space?.host?.icon, DEFAULT_VENUE_LOGO);

  const containerCssVars = useCss({
    "--venue-picture--background-image": `url(${venueIcon})`,
  });

  const containerClasses = classNames(
    "ScheduleVenueDescription",
    containerCssVars
  );

  const { subtitle, description } = space?.config?.landingPageConfig ?? {};

  return (
    <div className={containerClasses}>
      <div className="ScheduleVenueDescription__main">
        <div className="ScheduleVenueDescription__pic" />
        <div className="ScheduleVenueDescription__title">
          <h2 className="ScheduleVenueDescription__name">
            {space?.name ?? "Schedule"}
          </h2>
          <h3 className="ScheduleVenueDescription__subtitle">{subtitle}</h3>
        </div>
      </div>
      <div className="ScheduleVenueDescription__desc">
        <RenderMarkdown text={description} />
      </div>
    </div>
  );
};
