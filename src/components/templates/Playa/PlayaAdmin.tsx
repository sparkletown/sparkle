import React, { useState, useEffect } from "react";
import { useSelector } from "hooks/useSelector";
import firebase from "firebase/app";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

const PlayaAdmin: React.FC = () => {
  useConnectCurrentVenue();

  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  const playaVenue = useSelector((state) => state.firestore.data.currentVenue);

  useEffect(() => {
    setBannerMessage(playaVenue?.bannerMessage || "");
  }, [playaVenue]);

  const updateBanner = (message: string | null) => {
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateBannerMessage")(
        message ? { bannerMessage: message } : {}
      )
      .catch((e) => setError(e.toString()));
  };

  const setBanner = () => updateBanner(bannerMessage);
  const removeBanner = () => updateBanner(null);

  return (
    <>
      <div className="row">
        <h4>Playa Admin</h4>
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

export default PlayaAdmin;
