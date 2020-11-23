import React, { useState, useEffect, FC, useCallback } from "react";
import { useSelector } from "hooks/useSelector";
import firebase from "firebase/app";
import { PartyMapVenue } from "types/PartyMapVenue";
import { RootState } from "index";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMapAdmin: FC = () => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  const currentVenue = useSelector(partyMapVenueSelector);

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
      <div className="row">
        <h4>Banner Admin</h4>
      </div>
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
