import React, { useState, useEffect } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal } from "react-bootstrap";
import { VenueLandingPage } from "pages/VenueLandingPage";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import { DEFAULT_MAP_ICON_URL, PLAYA_WIDTH_AND_HEIGHT } from "settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import "./Preplaya.scss";

const isPlaced = (venue: Venue) => {
  return venue && venue.placement && venue.placement.x && venue.placement.y;
};

const Preplaya = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [venue, setVenue] = useState<Venue>();
  const [scale, setScale] = useState(
    window.innerWidth / PLAYA_WIDTH_AND_HEIGHT
  );
  const [zoom, setZoom] = useState(1.0);

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

  return (
    <>
      <div className="preplaya-container">
        <div className="map-container" style={{ transform: `scale(${zoom})` }}>
          <div className="demo-message">
            This is a demo of how camps look on the final, fully-interactive
            playa.
          </div>
          <img
            className="playa-background"
            src="/maps/playa2d.jpg"
            alt="Playa Background Map"
          />
          {venues?.filter(isPlaced).map((venue, idx) => (
            <div
              className="venue"
              style={{
                top: (venue.placement?.x || 0) * scale,
                left: (venue.placement?.y || 0) * scale,
                position: "absolute",
                transform: `scale(${zoom})`,
              }}
              onClick={() => showVenue(venue)}
              key={idx}
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
          {venue && (
            <VenueLandingPage venue={venue} venueRequestStatus={true} />
          )}
        </Modal>
        <div className="button-bar">
          <div className="button" onClick={() => setZoom(zoom + 0.1)}>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </div>
          <div className="button" onClick={() => setZoom(zoom - 0.1)}>
            <FontAwesomeIcon icon={faMinus} className="icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Preplaya;
