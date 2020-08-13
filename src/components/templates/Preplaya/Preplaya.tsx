import React, { useState, useEffect, useRef } from "react";
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
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rescale = () => {
      setScale(window.innerWidth / PLAYA_WIDTH_AND_HEIGHT);
    };

    let dragging = false;
    let translateX = 0;
    let translateY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let downListener = (event: MouseEvent) => {
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    };
    let touchStartListener = (event: TouchEvent) => {
      dragging = true;
      dragStartX = event.touches[0].clientX;
      dragStartY = event.touches[0].clientY;
    };
    let moveListener = (event: MouseEvent) => {
      if (dragging && mapRef.current) {
        event.preventDefault();
        setTranslateX(translateX + (event.clientX - dragStartX) / zoom);
        setTranslateY(translateY + (event.clientY - dragStartY) / zoom);
      }
    };
    let touchMoveListener = (event: TouchEvent) => {
      if (dragging && mapRef.current) {
        event.preventDefault();
        setTranslateX(translateX + event.touches[0].clientX - dragStartX);
        setTranslateY(translateY + event.touches[0].clientY - dragStartY);
      }
    };
    let dragEndListener = () => {
      dragging = false;
    };

    if (mapRef.current) {
      mapRef.current.addEventListener("mousedown", downListener);
      mapRef.current.addEventListener("touchstart", touchStartListener);
      window.addEventListener("mousemove", moveListener);
      window.addEventListener("touchmove", touchMoveListener);
      window.addEventListener("mouseup", dragEndListener);
      window.addEventListener("touchend", dragEndListener);
    }
    const mapRefCurrent = mapRef.current;

    window.addEventListener("resize", rescale);
    return () => {
      window.removeEventListener("resize", rescale);
      if (mapRefCurrent) {
        mapRefCurrent.removeEventListener("mousedown", downListener);
        mapRefCurrent.removeEventListener("touchstart", touchStartListener);
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("touchmove", touchMoveListener);
        window.removeEventListener("mouseup", dragEndListener);
        window.addEventListener("touchend", dragEndListener);
      }
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
        <div
          className="map-container"
          ref={mapRef}
          style={{
            transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
          }}
        >
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
