import React, { useState, useEffect, FC, useCallback } from "react";
import firebase from "firebase/app";

import { useSelector } from "hooks/useSelector";

import { RootState } from "index";

import "./AdminBanner.scss";

const currentVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0];

export const AdminBanner: FC = () => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  const currentVenue = useSelector(currentVenueSelector);

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
      <div className="edit-banner">
        <label htmlFor="bannerMessage">Banner Message:</label>
        <input
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
