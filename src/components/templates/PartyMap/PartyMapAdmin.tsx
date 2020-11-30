import React, { useState, useEffect, useCallback } from "react";

import { RootState } from "index";
import firebase from "firebase/app";

import { PartyMapVenue } from "types/PartyMapVenue";

import { useSelector } from "hooks/useSelector";

// TODO: we should move this to a common helper location
const makeUpdateBanner = (
  venueId: string,
  onError: (errorMsg: string) => void
) => (message?: string) => {
  const params = {
    venueId,
    bannerMessage: message ? message : "",
  };

  firebase
    .functions()
    .httpsCallable("venue-adminUpdateBannerMessage")(params)
    .catch((e) => onError(e.toString()));
};

// TODO: can this ever be undefined?
const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMapAdmin: React.FC = () => {
  const currentVenue = useSelector(partyMapVenueSelector);
  const venueId = currentVenue.id;

  const [error, setError] = useState<string | null>();
  const [bannerMessage, setBannerMessage] = useState(
    currentVenue?.bannerMessage
  );
  useEffect(() => {
    setBannerMessage(currentVenue?.bannerMessage || "");
  }, [currentVenue?.bannerMessage]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setBannerMessage(e.target.value);
    },
    []
  );

  const updateBannerInFirestore = useCallback(
    makeUpdateBanner(venueId, (errorMsg) => setError(errorMsg)),
    []
  );

  const saveBanner = useCallback(() => {
    updateBannerInFirestore(bannerMessage);
  }, [updateBannerInFirestore, bannerMessage]);

  const clearBanner = useCallback(() => updateBannerInFirestore(""), [
    updateBannerInFirestore,
  ]);

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
          onChange={handleInputChange}
          placeholder="Banner message"
        />
        {error && <span className="error">{error}</span>}
        <button className="btn btn-primary" type="submit" onClick={saveBanner}>
          Set Banner
        </button>
        <button className="btn btn-danger" type="submit" onClick={clearBanner}>
          Remove
        </button>
      </div>
    </>
  );
};
