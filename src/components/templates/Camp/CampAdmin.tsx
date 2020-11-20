import React, { useState, useEffect } from "react";
import { useSelector } from "hooks/useSelector";
import firebase from "firebase/app";
import { useVenueId } from "hooks/useVenueId";
import { currentVenueSelectorData } from "utils/selectors";

const CampAdmin: React.FC = () => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  const currentVenue = useSelector(currentVenueSelectorData);
  const venueId = useVenueId();

  useEffect(() => {
    setBannerMessage(currentVenue?.bannerMessage || "");
  }, [currentVenue]);

  const updateBanner = (message: string | null) => {
    const params = {
      venueId: venueId,
      bannerMessage: message ? message : "",
    };
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateBannerMessage")(params)
      .catch((e) => setError(e.toString()));
  };

  const setBanner = () => updateBanner(bannerMessage);
  const removeBanner = () => updateBanner("");

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

export default CampAdmin;
