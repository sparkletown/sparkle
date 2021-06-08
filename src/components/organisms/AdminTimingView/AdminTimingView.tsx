import React from "react";
import dayjs from "dayjs";

import "./AdminTimingView.scss";

export const AdminTimingView: React.FC = () => {
  return (
    <div className="creation-page-container creation-page-container--timing">
      <div className="creation-page-left">
        <div className="creation-page-left-bottombar">
          <div className="creation-page-left-bottombar-btnleft">
            {/* <a className="btn btn--light btn--icon"><span className="icon icon--home"></span></a> */}
          </div>
          <div className="creation-page-left-bottombar-btnright">
            <button className="btn btn--light  btn--back btn--back--4">
              Back
            </button>
            <button className="btn theme--primary btn--next btn--next--4">
              Next
            </button>
          </div>
        </div>
        <div className="creation-page-left-content">
          <h2 className="mb-1">Plan your events</h2>

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
          </div>
        </div>
      </div>
      <div className="creation-page-right">
        <div className="creation-page-right-content">
          <div className="events-container">
            <h4 className="party-heading">Events Schedule</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
