import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { TabNavigationProps } from "components/organisms/AdminVenueView/AdminVenueView";
import { TabFooter } from "components/organisms/AdminVenueView/components/TabFooter";

import { LoadingPage } from "components/molecules/LoadingPage";

import { EventsView } from "../EventsView";

import "./Timing.scss";

interface TimingProps extends TabNavigationProps {
  venue?: WithId<AnyVenue>;
}

export const Timing: React.FC<TimingProps> = ({
  venue,
  ...tabNavigationProps
}) => {
  if (!venue) {
    return <LoadingPage />;
  }

  return (
    <div className="Timing">
      <div className="Timing__left">
        <TabFooter {...tabNavigationProps} />
        <div className="Timing__left-content">
          <h2 className="mb-1">Plan your events</h2>

          {/* @debt: global start/end times will be added later
            <div>
              <h4 className="party-heading">Global starting time</h4>
              <h4 className="party-subheading">
                When does your party start?
                <br />
                Use your local time zone, it will be automatically converted for
                anyone visiting from around the world.
              </h4>
              <input
                type="date"
                min={dayjs().format("YYYY-MM-DD")}
                name="start_date"
                className="input-block input-left"
              />
              <input
                type="time"
                name="start_time"
                className="input-block input-right"
              />
            </div>

            <div>
              <h4 className="party-heading">Global ending time</h4>
              <input
                type="date"
                min={dayjs().format("YYYY-MM-DD")}
                name="start_date"
                className="input-block input-left"
              />
              <input
                type="time"
                name="start_time"
                className="input-block input-right"
              />
            </div> */}
        </div>
      </div>
      <div className="Timing__right">
        <div className="Timing__right-content">
          <EventsView venueId={venue.id} venue={venue} />
        </div>
      </div>
    </div>
  );
};
