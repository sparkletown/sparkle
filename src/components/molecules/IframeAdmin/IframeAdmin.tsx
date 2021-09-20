import React, { useEffect, useState } from "react";

import { updateIframeUrl } from "api/venue";

import { AnyVenue } from "types/venues";

import "./IframeAdmin.scss";

interface IframeAdminProps {
  venueId?: string;
  venue: AnyVenue;
}

export const IframeAdmin: React.FC<IframeAdminProps> = ({ venueId, venue }) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    setIframeUrl(venue?.iframeUrl || "");
  }, [venue]);

  const saveIframeUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    updateIframeUrl(iframeUrl, venueId).catch((err) =>
      setError(err.toString())
    );
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
                autoComplete="off"
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
