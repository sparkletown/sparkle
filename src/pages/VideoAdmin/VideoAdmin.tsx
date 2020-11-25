import React, { useState, useEffect } from "react";
import { useSelector } from "hooks/useSelector";
import firebase from "firebase/app";
import { useVenueId } from "hooks/useVenueId";
import { currentVenueSelectorData } from "utils/selectors";

const VideoAdmin: React.FC = () => {
  const venueId = useVenueId();
  const [iframeUrl, setIframeUrl] = useState("");
  const [error, setError] = useState<string | null>();

  const venue = useSelector(currentVenueSelectorData);

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

  return (
    <>
      <div className="row">
        <h4>Video Admin</h4>
      </div>
      <div className="edit-banner">
        <label htmlFor="bannerMessage">iframe URL for {venue?.name}:</label>
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

export default VideoAdmin;
