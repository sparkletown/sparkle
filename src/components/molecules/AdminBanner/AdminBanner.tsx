import React, { useState, useEffect, FC, useCallback } from "react";
import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

import "./AdminBanner.scss";

interface AdminBannerProps {
  venueId?: string;
  venue: AnyVenue;
}

export const AdminBanner: FC<AdminBannerProps> = ({ venueId, venue }) => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    setBannerMessage(venue?.bannerMessage || "");
  }, [venue]);

  const updateBanner = useCallback(
    (message: string | null) => {
      const params = {
        venueId: venueId,
        bannerMessage: message ? message : "",
      };
      firebase
        .functions()
        .httpsCallable("venue-adminUpdateBannerMessage")(params)
        .catch((e) => setError(e.toString()));
    },
    [venueId]
  );

  const setBanner = useCallback(() => {
    updateBanner(bannerMessage);
  }, [bannerMessage, updateBanner]);

  const removeBanner = useCallback(() => updateBanner(""), [updateBanner]);

  return (
    <div className="admin-banner-container">
      <label htmlFor="bannerMessage">Banner Message:</label>
      <input
        className="banner-input"
        type="text"
        value={bannerMessage}
        onChange={(e) => {
          setError(null);
          setBannerMessage(e.target.value);
        }}
        placeholder="Banner message"
      />
      {error && <span className="error">{error}</span>}
      <button className="btn btn-primary" type="submit" onClick={setBanner}>
        Set Banner
      </button>
      <button className="btn btn-danger" type="submit" onClick={removeBanner}>
        Remove
      </button>
    </div>
  );
};
