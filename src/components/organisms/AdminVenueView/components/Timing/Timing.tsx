import React, { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { makeVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { EventsView } from "../EventsView";

import "./Timing.scss";

export type TimingProps = {
  venueId?: string;
  onClickNext: () => void;
  onClickBack: () => void;
};

export const Timing: React.FC<TimingProps> = ({
  venueId,
  onClickNext,
  onClickBack,
}) => {
  const venueSelector = useCallback(
    (state) => makeVenueSelector(venueId!)(state),
    [venueId]
  );

  const venue = useSelector(venueSelector, shallowEqual);

  return (
    <div className="Timing">
      <div className="Timing__left">
        <div className="Timing__left-bottombar">
          <div className="Timing__left-bottombar-btnleft">
            <a
              href="/admin-ng"
              className="Timing__left-bottombar-btngrey btn-grey__home"
            >
              <FontAwesomeIcon
                icon={faHome}
                className="edit-button__icon"
                size="lg"
              />
            </a>
          </div>
          <div className="Timing__left-bottombar-btnright">
            <button
              className="Timing__left-bottombar-btngrey"
              onClick={onClickBack}
            >
              Back
            </button>
            <button className="btn btn-primary" onClick={onClickNext}>
              Next
            </button>
          </div>
        </div>
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
          <EventsView venueId={venueId!} venue={venue!} />
        </div>
      </div>
    </div>
  );
};
