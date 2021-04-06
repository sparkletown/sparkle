import React from "react";
import "firebase/storage";
import "./Account.scss";
import {
  DEFAULT_VENUE,
  PLAYA_IMAGE,
  PLAYA_VENUE_NAME,
  SPARKLEVERSE_LOGO_URL,
} from "settings";
import { useHistory } from "react-router-dom";
import { venueInsideUrl } from "utils/url";

const Step6 = () => {
  const history = useHistory();
  return (
    <div className="splash-page-container">
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt={`${PLAYA_VENUE_NAME} Background Map`}
      />
      <div className="step-container step6b-container">
        <div className="navigation-guide">
          <div className="row heading">
            <div className="col-md-8">
              <span className="navigating-header">
                Navigating the {PLAYA_VENUE_NAME}.
              </span>
            </div>
            <div className="col-md-4 logo-container">
              <img
                className="img-fluid logo"
                src={SPARKLEVERSE_LOGO_URL}
                alt="SparkleVerse logo"
                title="SparkleVerse logo"
              />
            </div>
          </div>
          <div className="row content">
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <img
                    className="img-fluid action-image"
                    src="/onboarding-page/view.jpg"
                    alt="View"
                    title="View"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-lg-12">
                  <span className="action-title">View</span>
                </div>
                <div className="col-xl-8 col-lg-12">
                  <span className="action-details">
                    Use your mouse cursor to click and drag your view around the
                    {PLAYA_VENUE_NAME}.
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <img
                    className="img-fluid action-image"
                    src="/onboarding-page/move.jpg"
                    alt="Move"
                    title="Move"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-lg-12">
                  <span className="action-title">Move</span>
                </div>
                <div className="col-xl-8 col-lg-12">
                  <span className="action-details">
                    Use the arrow keys to move your avatar around the{" "}
                    {PLAYA_VENUE_NAME}.
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <img
                    className="img-fluid action-image"
                    src="/onboarding-page/search.jpg"
                    alt="Search"
                    title="Search"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 col-lg-12">
                  <span className="action-title">Search</span>
                </div>
                <div className="col-xl-6 col-lg-12">
                  <span className="action-details">
                    Click the drop-down to view and search for venues &amp;
                    events
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="row cta">
              <div className="col-md-12">
                <div className="step6b-welcome-message">
                  Welcome to the Burn. Use the arrows on your keyboard or the
                  webpage to navigate the {PLAYA_VENUE_NAME}, or use the search
                  bar above, or just click directly on venues to explore.
                </div>
                <button
                  className={`btn btn-primary btn-block btn-centered`}
                  onClick={() => history.push(venueInsideUrl(DEFAULT_VENUE))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6;
