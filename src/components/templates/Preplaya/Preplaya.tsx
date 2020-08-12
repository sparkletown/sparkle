import React, { useState, useEffect, useMemo } from "react";
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
  const [zoom, setZoom] = useState(1);
  const [scale, setScale] = useState(
    (window.innerWidth / PLAYA_WIDTH_AND_HEIGHT) * zoom
  );

  useEffect(() => {
    const rescale = () => {
      setScale((window.innerWidth / PLAYA_WIDTH_AND_HEIGHT) * zoom);
    };

    window.addEventListener("resize", rescale);
    return () => {
      window.removeEventListener("resize", rescale);
    };
  }, []);

  useEffect(() => {
    setScale((window.innerWidth / PLAYA_WIDTH_AND_HEIGHT) * zoom);
  }, [zoom]);

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
        <img
          className="playa-background"
          src="/maps/playa2d.jpg"
          alt="Playa Background Map"
          style={{ width: `${zoom * 100}%` }}
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
      <div className="zoom-controls">
        <div
          className="zoom-action"
          onClick={() => setZoom((zoom) => zoom + 1)}
        >
          +
        </div>
        <div
          className="zoom-action"
          onClick={() => setZoom((zoom) => Math.max(1, zoom - 1))}
        >
          -
        </div>
        <div className="zoom-action" onClick={() => setZoom(1)}>
          reset
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {venue && <VenueLandingPage venue={venue} venueRequestStatus={true} />}
      </Modal>
    </>
  );
};

export default Preplaya;
