import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

import "./AdminVideo.scss";

interface AdminVideoProps {
  venueId?: string;
  venue: AnyVenue;
}

export const AdminVideo: React.FC<AdminVideoProps> = ({ venueId, venue }) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    setIframeUrl(venue?.iframeUrl || "");
  }, [venue]);

  const updateIframeUrl = (iframeUrl: string) => {
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateIframeUrl")({ venueId, iframeUrl })
      .catch((e) => setError(e.toString()));
  };

  const saveIframeUrl = () => updateIframeUrl(iframeUrl);

  return (
    <div className="admin-video-container">
      <label htmlFor="bannerMessage">iframe URL for {venue?.name}:</label>
      <input
        className="video-input"
        type="text"
        value={iframeUrl}
        onChange={(e) => {
          setError(null);
          setIframeUrl(e.target.value);
        }}
        placeholder="https://youtube.com/embed/..."
      />
      {error && <span className="error">{error}</span>}
      <button className="btn btn-primary" type="submit" onClick={saveIframeUrl}>
        Set iframe URL
      </button>
    </div>
  );
};
