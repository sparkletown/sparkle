import React, { useState } from "react";
import { useAsyncFn } from "react-use";

import { updateVenue_v2 } from "api/admin";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

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
  const { user } = useUser();
  const [startUtcSeconds, setStartUtcSeconds] = useState(
    venue?.start_utc_seconds
  );
  const [endUtcSeconds, setEndUtcSeconds] = useState(venue?.end_utc_seconds);

  const [, handleVenueUpdate] = useAsyncFn(async () => {
    if (!venue?.name || !user) return;

    updateVenue_v2(
      {
        start_utc_seconds: startUtcSeconds,
        end_utc_seconds: endUtcSeconds,
        name: venue?.name,
      },
      user
    );
  }, [venue, user, startUtcSeconds, endUtcSeconds]);

  if (!venue) {
    return <LoadingPage />;
  }

  return (
    <div className="Timing">
      <div className="Timing__left">
        <TabFooter
          {...tabNavigationProps}
          handleVenueUpdate={handleVenueUpdate}
        />
        <div className="Timing__content">
          <h2 className="Timing__header">Plan your events</h2>
          <DateTimeField
            title="Global starting time"
            subTitle="When does your party start?"
            dateTimeValue={startUtcSeconds}
            onChange={setStartUtcSeconds}
          />
          <DateTimeField
            title="Global ending time"
            dateTimeValue={endUtcSeconds}
            onChange={setEndUtcSeconds}
          />
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
