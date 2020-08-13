import React, { useState, useEffect } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal } from "react-bootstrap";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import { DEFAULT_MAP_ICON_URL, PLAYA_WIDTH_AND_HEIGHT } from "settings";
import VenuePreview from "./VenuePreview";

import "./Preplaya.scss";
import { WithId } from "utils/id";
import { updateLocationData } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";

const isPlaced = (venue: Venue) => {
  return venue && venue.placement;
};

const Preplaya = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [venue, setVenue] = useState<WithId<Venue>>();
  const [scale, setScale] = useState(
    window.innerWidth / PLAYA_WIDTH_AND_HEIGHT
  );

  const { user } = useUser();

  useEffect(() => {
    const rescale = () => {
      setScale(window.innerWidth / PLAYA_WIDTH_AND_HEIGHT);
    };

    window.addEventListener("resize", rescale);
    return () => {
      window.removeEventListener("resize", rescale);
    };
  }, []);

  const { venues } = useSelector((state) => ({
    venues: state.firestore.ordered.venues,
  }));

  const showVenue = (venue: WithId<Venue>) => {
    setVenue(venue);
    setShowModal(true);
  };

  return (
    <>
      <div className="preplaya-container">
        <img
          className="playa-background"
          src="/maps/playa2d.jpg"
          alt="Playa Background Map"
        />
        {venues?.filter(isPlaced).map((venue) => (
          <div
            className="venue"
            style={{
              top: (venue.placement?.x || 0) * scale,
              left: (venue.placement?.y || 0) * scale,
              position: "absolute",
            }}
            onClick={() => showVenue(venue)}
          >
            <img
              className="venue-icon"
              src={venue.mapIconImageUrl || DEFAULT_MAP_ICON_URL}
              alt={`${venue.name} Icon`}
            />
          </div>
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          user && updateLocationData(user, "playa");
        }}
      >
        {venue && <VenuePreview venue={venue} />}
      </Modal>
    </>
  );
};

export default Preplaya;
