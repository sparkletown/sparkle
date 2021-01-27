import React, { useState, useEffect, FC, useCallback } from "react";
import firebase from "firebase/app";

import { useSelector } from "hooks/useSelector";

import { venueSelector } from "utils/selectors";

import "./AdminBanner.scss";

export const AdminBanner: FC = () => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  const currentVenue = useSelector(venueSelector);

  useEffect(() => {
    setBannerMessage(currentVenue?.bannerMessage || "");
  }, [currentVenue]);

  const updateBanner = useCallback(
    (message: string | null) => {
      const params = {
        venueId: currentVenue?.id,
        bannerMessage: message ? message : "",
      };
      firebase
        .functions()
        .httpsCallable("venue-adminUpdateBannerMessage")(params)
        .catch((e) => setError(e.toString()));
    },
    [currentVenue]
  );

  const setBanner = useCallback(() => {
    updateBanner(bannerMessage);
  }, [bannerMessage, updateBanner]);

  const removeBanner = useCallback(() => updateBanner(""), [updateBanner]);

  return (
    <>
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
    </>
  );
};
