import React, { useState, useCallback, useRef } from "react";

import { makeUpdateBanner } from "api/bannerAdmin";

import { currentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

export const BannerAdmin: React.FC = () => {
  const currentVenue = useSelector(currentVenueSelector);
  const venueId = currentVenue?.id;
  const existingBannerMessage = currentVenue?.bannerMessage ?? "";

  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>();

  const handleInputChange = useCallback(() => {
    setError(null);
  }, []);

  const updateBannerInFirestore = useCallback(
    (msg?: string) => {
      if (!venueId) return;

      makeUpdateBanner(venueId, (errorMsg) => setError(errorMsg))(msg);
    },
    [venueId]
  );

  const saveBanner = useCallback(() => {
    if (!inputFieldRef.current) return;

    updateBannerInFirestore(inputFieldRef.current.value);

    return false;
  }, [updateBannerInFirestore]);

  const clearBanner = useCallback(() => updateBannerInFirestore(""), [
    updateBannerInFirestore,
  ]);

  return (
    <div className="container">
      <h3>Banner Admin</h3>

      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="bannerMessage">Banner Message</label>

              <input
                ref={inputFieldRef}
                type="text"
                defaultValue={existingBannerMessage}
                onChange={handleInputChange}
                placeholder="Enter banner message here..."
              />

              {error && <span className="error">{error}</span>}
            </div>

            <div className="form-inline justify-content-between">
              <button
                className="btn btn-danger"
                type="reset"
                onClick={clearBanner}
              >
                Clear Banner
              </button>

              <button
                className="btn btn-primary"
                type="submit"
                onClick={saveBanner}
              >
                Save Banner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
