import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { TabNavigationProps } from "components/organisms/AdminVenueView/AdminVenueView";
import { TabFooter } from "components/organisms/AdminVenueView/components/TabFooter";

import { LoadingPage } from "components/molecules/LoadingPage";

import { DateTimeField } from "../DateTimeField";
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
        <div className="Timing__left--content">
          <h2 className="Timing__left--header">Plan your events</h2>
          <DateTimeField
            title="Global starting time"
            subTitle="When does your party start?"
            name="start"
          />
          <DateTimeField title="Global ending time" name="end" />
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
