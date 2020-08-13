import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal } from "react-bootstrap";
import { VenueLandingPage } from "pages/VenueLandingPage";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import { DEFAULT_MAP_ICON_URL, PLAYA_WIDTH_AND_HEIGHT } from "settings";

import "./Preplaya.scss";

const isPlaced = (venue: Venue) => {
  return venue && venue.placement;
};

const Preplaya = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [venue, setVenue] = useState<Venue>();
  const [scale, setScale] = useState(
    window.innerWidth / PLAYA_WIDTH_AND_HEIGHT
  );

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

  const showVenue = (venue: Venue) => {
    setVenue(venue);
    setShowModal(true);
  };

  const { camp } = useParams();
  useEffect(() => {
    if (camp) {
      const campVenue = venues?.find((venue) => venue.id === camp);
      if (campVenue) {
        showVenue(campVenue);
      }
    }
  }, [camp, venues]);

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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        Venue Modal Preview Goes Here
      </Modal>
    </>
  );
};

export default Preplaya;
