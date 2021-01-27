import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";
import { useUserIsVenueOwner } from "hooks/useUserIsVenueOwner";

import { currentVenueSelectorData } from "utils/selectors";

import "./AdminVideo.scss";

export const AdminVideo: React.FC = () => {
  const venueId = useVenueId();
  const [iframeUrl, setIframeUrl] = useState("");
  const [error, setError] = useState<string | null>();

  const venue = useSelector(currentVenueSelectorData);
  const isVenueOwner = useUserIsVenueOwner();

  useEffect(() => {
    setIframeUrl(venue?.iframeUrl || "");
  }, [venue]);

  const updateIframeUrl = (iframeUrl: string | null) => {
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateIframeUrl")({ venueId, iframeUrl })
      .catch((e) => setError(e.toString()));
  };

  const saveIframeUrl = () => updateIframeUrl(iframeUrl);

  if (!isVenueOwner) {
    return <>{`You don't have the permissions to access this page`}</>;
  }

  return (
    <>
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
        <button
          className="btn btn-primary"
          type="submit"
          onClick={saveIframeUrl}
        >
          Set iframe URL
        </button>
      </div>
    </>
  );
};
