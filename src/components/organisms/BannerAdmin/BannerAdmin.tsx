import React, { useState, useCallback, useRef } from "react";

import { makeUpdateBanner } from "api/bannerAdmin";

import { AnyVenue } from "types/venues";

interface BannerAdminProps {
  venueId?: string;
  venue: AnyVenue;
}

export const BannerAdmin: React.FC<BannerAdminProps> = ({ venueId, venue }) => {
  const existingBannerMessage = venue?.bannerMessage ?? "";

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

  const saveBanner = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!inputFieldRef.current) return;

      updateBannerInFirestore(inputFieldRef.current.value);
    },
    [updateBannerInFirestore]
  );

  const clearBanner = useCallback(() => updateBannerInFirestore(""), [
    updateBannerInFirestore,
  ]);

  return (
    <div className="container">
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
