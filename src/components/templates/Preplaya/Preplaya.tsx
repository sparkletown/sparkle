import React, { useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal } from "react-bootstrap";
import { VenueLandingPage } from "pages/VenueLandingPage";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";

import "./Preplaya.scss";

const isPlaced = (venue: Venue) => {
  return venue && venue.placement;
};

const Preplaya = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [venue, setVenue] = useState<Venue>();

  const { venues } = useSelector((state) => ({
    venues: state.firestore.ordered.venues,
  }));

  const showVenue = (venue: Venue) => {
    setVenue(venue);
    setShowModal(true);
  };

  const scale = window.innerWidth / 4000; // city is 4000x4000 pixels

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
              top: (venue.placement?.x || 0) / scale,
              left: (venue.placement?.y || 0) / scale,
              zoom: scale,
            }}
            onClick={() => showVenue(venue)}
          />
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {venue && <VenueLandingPage venue={venue} venueRequestStatus={true} />}
      </Modal>
    </>
  );
};

export default Preplaya;
