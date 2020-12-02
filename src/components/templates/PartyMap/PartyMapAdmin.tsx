import React, { useState, useEffect, useCallback } from "react";

import { makeUpdateBanner } from "api/partyMapAdmin";

import { currentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

export const PartyMapAdmin: React.FC = () => {
  const currentVenue = useSelector(currentVenueSelector);
  const venueId = currentVenue.id;
  const existingBannerMessage = currentVenue?.bannerMessage ?? "";

  const [error, setError] = useState<string | null>();

  // TODO: do we need to useState for this? It will cause a re-render on every keypress (only in this component probably.. but still).
  //  Can we useRef() passed to the input field itself or similar instead?
  const [newBannerMessage, setNewBannerMessage] = useState(
    existingBannerMessage
  );

  useEffect(() => {
    setNewBannerMessage(existingBannerMessage);
  }, [existingBannerMessage]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setNewBannerMessage(e.target.value);
    },
    []
  );

  const updateBannerInFirestore = useCallback(
    makeUpdateBanner(venueId, (errorMsg) => setError(errorMsg)),
    []
  );

  const saveBanner = useCallback(() => {
    updateBannerInFirestore(newBannerMessage);
  }, [updateBannerInFirestore, newBannerMessage]);

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
          value={newBannerMessage}
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
