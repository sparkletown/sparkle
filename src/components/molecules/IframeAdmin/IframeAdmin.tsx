import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

import "./IframeAdmin.scss";

interface IframeAdminProps {
  venueId?: string;
  venue: AnyVenue;
}

// @debt This component is almost exactly the same as BannerAdmin, we should refactor them both to use the same generic base component
//   BannerAdmin is the 'canonical example' to follow when we do this
export const IframeAdmin: React.FC<IframeAdminProps> = ({ venueId, venue }) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    setIframeUrl(venue?.iframeUrl || "");
  }, [venue]);

  // @debt refactor this into api/*
  const updateIframeUrl = (iframeUrl: string) => {
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateIframeUrl")({ venueId, iframeUrl })
      .catch((e) => setError(e.toString()));
  };

  const saveIframeUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    updateIframeUrl(iframeUrl);
  };

  return (
    <div className="container IframeAdmin">
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="bannerMessage">
                iframe URL for {venue?.name}:
              </label>

              <input
                type="text"
                value={iframeUrl}
                onChange={(e) => {
                  setError(null);
                  setIframeUrl(e.target.value);
                }}
                placeholder="https://youtube.com/embed/..."
              />

              {error && <span className="error">{error}</span>}
            </div>

            <div className="form-inline justify-content-end">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={saveIframeUrl}
              >
                Set iframe URL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
